import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BarChart3, Users, Ticket, TrendingUp, LogOut } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    activeUsers: 0
  })
  const [tickets, setTickets] = useState([])
  const [chartData, setChartData] = useState([])
  const [editingTicket, setEditingTicket] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      
      const ticketsResponse = await axios.get('http://localhost:5000/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const statsResponse = await axios.get('http://localhost:5000/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })

      setTickets(ticketsResponse.data)
      setStats(statsResponse.data)

      // Generate chart data
      const data = generateChartData(ticketsResponse.data)
      setChartData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const generateChartData = (ticketsData) => {
    // Generate real chart data from tickets
    const statusCounts = {
      'open': 0,
      'in-progress': 0,
      'resolved': 0,
      'closed': 0
    }
    
    ticketsData.forEach(ticket => {
      if (statusCounts[ticket.status] !== undefined) {
        statusCounts[ticket.status]++
      }
    })
    
    // Return real data instead of random
    return [{
      month: 'Current',
      tickets: ticketsData.length,
      resolved: statusCounts['resolved']
    }]
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket.id)
    setNewStatus(ticket.status)
  }

  const handleUpdateStatus = async (ticketId) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.put(
        `http://localhost:5000/tickets/${ticketId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update the ticket in the list
      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, status: newStatus } : t
      ))
      
      setEditingTicket(null)
      setNewStatus('')
      
      // Refresh data
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating ticket status:', error)
      alert('Failed to update ticket status')
    }
  }

  const handleCancel = () => {
    setEditingTicket(null)
    setNewStatus('')
  }

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors['open']
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']

  return (
    <DashboardLayout onLogout={handleLogout} isAdmin={true}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage tickets, users, and view analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Ticket className="text-blue-600" size={28} />}
            label="Total Tickets"
            value={stats.totalTickets}
            trend="+12% from last month"
          />
          <StatCard
            icon={<TrendingUp className="text-orange-600" size={28} />}
            label="Open Tickets"
            value={stats.openTickets}
            trend={`${Math.round(stats.openTickets / stats.totalTickets * 100)}% of total`}
          />
          <StatCard
            icon={<BarChart3 className="text-green-600" size={28} />}
            label="Resolved"
            value={stats.resolvedTickets}
            trend="Resolution rate"
          />
          <StatCard
            icon={<Users className="text-purple-600" size={28} />}
            label="Active Users"
            value={stats.activeUsers}
            trend="This month"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ticket Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Open', value: stats.openTickets || 0 },
                    { name: 'In Progress', value: tickets.filter(t => t.status === 'in-progress').length },
                    { name: 'Resolved', value: stats.resolvedTickets || 0 },
                    { name: 'Closed', value: tickets.filter(t => t.status === 'closed').length }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Tickets</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.slice(0, 10).map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{ticket.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ticket.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.user_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.category}</td>
                    <td className="px-6 py-4">
                      {editingTicket === ticket.id ? (
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingTicket === ticket.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(ticket.id)}
                            className="text-green-600 hover:text-green-800 font-semibold transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800 font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditTicket(ticket)}
                          className="text-blue-600 hover:text-blue-800 font-semibold transition"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      </div>
      <p className="text-xs text-gray-500">{trend}</p>
    </div>
  )
}
