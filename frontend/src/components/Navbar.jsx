import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-black bg-opacity-20 backdrop-blur border-b border-white border-opacity-10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CD</span>
          </div>
          <span className="text-white font-bold text-xl hidden md:block">CloudDesk</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <a href="#services" className="hover:text-accent transition">Services</a>
          <a href="#features" className="hover:text-accent transition">Features</a>
          <a href="#pricing" className="hover:text-accent transition">Pricing</a>
          <a href="#contact" className="hover:text-accent transition">Contact</a>
        </div>
        
        {/* Auth Links */}
        <div className="hidden md:flex items-center gap-4">
          <select className="bg-white bg-opacity-10 text-white px-4 py-2 rounded-lg text-sm border border-white border-opacity-20">
            <option className="bg-primary text-white">English</option>
          </select>
          <Link to="/login" className="text-white hover:text-accent transition font-semibold">Login</Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black bg-opacity-40 backdrop-blur">
          <div className="px-4 py-4 space-y-4 text-white">
            <a href="#services" className="block hover:text-accent">Services</a>
            <a href="#features" className="block hover:text-accent">Features</a>
            <a href="#pricing" className="block hover:text-accent">Pricing</a>
            <a href="#contact" className="block hover:text-accent">Contact</a>
            <Link to="/login" className="block text-accent font-semibold">Login</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
