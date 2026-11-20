import { Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-40 backdrop-blur border-t border-white border-opacity-10 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">CloudDesk</h4>
            <p className="text-gray-300 text-sm">Service Management Platform</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Product</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Security</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Follow</h5>
            <div className="flex gap-4">
              <Github size={20} className="cursor-pointer hover:text-accent transition" />
              <Twitter size={20} className="cursor-pointer hover:text-accent transition" />
              <Linkedin size={20} className="cursor-pointer hover:text-accent transition" />
            </div>
          </div>
        </div>
        <div className="border-t border-white border-opacity-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 CloudDesk. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
