import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogOut, Plus, Eye, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

export default function UserDashboard() {
  const [tickets, setTickets] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical'
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchTickets()
    // Auto-refresh tickets every 5 seconds to see admin updates
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get('http://localhost:5000/tickets/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTickets(response.data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      await axios.post('http://localhost:5000/tickets', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setFormData({ title: '', description: '', category: 'technical' })
      setShowModal(false)
      fetchTickets()
    } catch (error) {
      console.error('Error creating ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    navigate('/login')
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

  const getStatusIcon = (status) => {
    const icons = {
      'open': <AlertCircle size={16} />,
      'in-progress': <Clock size={16} />,
      'resolved': <CheckCircle size={16} />,
      'closed': <CheckCircle size={16} />
    }
    return icons[status]
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
              <p className="text-gray-600 mt-1">Track and manage your support tickets</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition"
            >
              <Plus size={20} />
              Create Ticket
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<AlertCircle className="text-blue-600" size={24} />}
            label="Total Tickets"
            value={tickets.length}
          />
          <StatCard
            icon={<Clock className="text-yellow-600" size={24} />}
            label="In Progress"
            value={tickets.filter(t => t.status === 'in-progress').length}
          />
          <StatCard
            icon={<CheckCircle className="text-green-600" size={24} />}
            label="Resolved"
            value={tickets.filter(t => t.status === 'resolved').length}
          />
          <StatCard
            icon={<Eye className="text-purple-600" size={24} />}
            label="Open"
            value={tickets.filter(t => t.status === 'open').length}
          />
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No tickets found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{ticket.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ticket.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ticket.category}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button className="text-primary hover:text-secondary transition p-1">
                          <Eye size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700 transition p-1">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Create New Ticket</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      </div>
    </div>
  )
}
