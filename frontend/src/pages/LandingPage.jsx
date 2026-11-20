import { Link } from 'react-router-dom'
import { MessageCircle, BarChart3, Users, Send, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="inline-block bg-white bg-opacity-20 backdrop-blur rounded-full px-4 py-2">
              <span className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                Trusted by 10,000+ companies
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Simplify your workflow with <span className="text-accent">CloudDesk</span>
            </h1>
            
            <p className="text-lg text-gray-100 max-w-lg">
              Easily create, assign, manage, and resolve tickets. Host CloudDesk on your preferred server and start using it right away.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Link 
                to="/login"
                className="inline-flex items-center justify-center bg-accent hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                <MessageCircle size={20} className="mr-2" />
                Login CloudDesk
              </Link>
              <Link 
                to="/register"
                className="inline-flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-8 rounded-lg backdrop-blur transition"
              >
                <Send size={20} className="mr-2" />
                Submit ticket
              </Link>
            </div>
            
            <div className="flex gap-8 pt-8 border-t border-white border-opacity-20">
              <div>
                <p className="text-sm text-gray-200">Free 14-day trial</p>
              </div>
              <div>
                <p className="text-sm text-gray-200">No credit card required</p>
              </div>
              <div>
                <p className="text-sm text-gray-200">24/7 support</p>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 border border-white border-opacity-20">
              <div className="bg-gradient-to-br from-blue-300 to-purple-300 rounded-xl h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={64} className="text-white mx-auto mb-4 opacity-50" />
                  <p className="text-white text-sm opacity-60">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-white bg-opacity-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powerful Features for Your Support Team
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageCircle size={32} />}
              title="Ticket Management"
              description="Create, assign, and track support tickets with ease"
            />
            <FeatureCard 
              icon={<Users size={32} />}
              title="Team Collaboration"
              description="Collaborate with your team to resolve issues faster"
            />
            <FeatureCard 
              icon={<BarChart3 size={32} />}
              title="Analytics & Reports"
              description="Get insights with detailed analytics and reporting"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition">
      <div className="text-accent mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-200">{description}</p>
    </div>
  )
}
