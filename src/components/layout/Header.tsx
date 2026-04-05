import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'
import { CarIcon, MenuIcon, XIcon } from 'lucide-react'
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navLinks = [
    {
      path: '/',
      label: 'Home',
    },
    {
      path: '/about',
      label: 'About',
    },
    {
      path: '/vehicles',
      label: 'Vehicles',
    },
    {
      path: '/locations',
      label: 'Locations',
    },
    {
      path: '/contact',
      label: 'Contact',
    },
  ]
  const isActive = (path: string) => location.pathname === path
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 mb-8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <CarIcon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-xl font-bold text-slate-900">AutoHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Book Now
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium ${isActive(link.path) ? 'text-blue-600' : 'text-slate-600'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="md" className="w-full">
                    Book Now
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
