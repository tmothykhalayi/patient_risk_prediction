import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
//import { Card } from '../components/ui/Card'
import { Header } from '../components/layout/Header'
import { z } from 'zod'

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      // Validate form data with Zod
      const validatedData = loginSchema.parse(formData)
      
      // Handle login logic here
      console.log('Login attempt:', validatedData)
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        // Add your login logic here
      }, 1000)
    } catch (error) {
      setIsSubmitting(false)
      if (error instanceof z.ZodError) {
        // Convert Zod errors to form errors
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
        error.issues.forEach((err) => {
          const pathPart = err.path[0]
          if (typeof pathPart === 'string') {
            fieldErrors[pathPart as keyof LoginFormData] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginFormData]) {
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
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
              alt="Luxury vehicle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-slate-900/80 flex items-center justify-center p-12">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Access your account to manage bookings, view rental history, and enjoy exclusive member benefits.
                </p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Log in to AutoHub
              </h1>
              <p className="text-slate-600">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Your data is secure and protected with industry-standard encryption.
          </p>
        </div>
      </div>
      </div>
    </div>
      </>
  )
}
