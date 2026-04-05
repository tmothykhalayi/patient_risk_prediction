import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
//import { Card } from '../components/ui/Card'
import { Header } from '../components/layout/Header'
import { z } from 'zod'

// Zod validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  terms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      // Validate form data with Zod
      const validatedData = registerSchema.parse(formData)
      
      // Handle registration logic here
      console.log('Registration attempt:', validatedData)
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        // Add your registration logic here
      }, 1000)
    } catch (error) {
      setIsSubmitting(false)
      if (error instanceof z.ZodError) {
        // Convert Zod errors to form errors
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0] as keyof RegisterFormData] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }
  return (
    <>
      <Header />
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-6xl mx-4 my-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Vehicle Image Side */}
          <div className="relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
              alt="Premium vehicle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-slate-900/80 flex items-center justify-center p-12">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-4">Join AutoHub Today!</h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Create an account to unlock exclusive deals, manage your rentals seamlessly, and enjoy premium service.
                </p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Create Your Account
              </h1>
              <p className="text-slate-600">
                Start your journey with AutoHub in minutes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-1"
                />
                <label className="ml-2 text-sm text-slate-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Log in
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Your information is secure. We never share your personal data.
          </p>
        </div>
      </div>
      </div>
    </div>
            </>
  )
}
