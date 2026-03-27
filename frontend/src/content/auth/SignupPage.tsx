import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export function SignupPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    medications: '',
    chronicConditions: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [agreed, setAgreed] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }

    if (!agreed) {
      newErrors.agreed = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Calculate age from date of birth
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--
      }

      // Parse medications and chronic conditions from comma-separated strings
      const medicationsArray = formData.medications
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m !== '')

      const chronicConditionsArray = formData.chronicConditions
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c !== '')

      // Build a RegisterRequest from the form data
      await register({
        name: formData.fullName,
        phone_number: formData.phoneNumber,
        password: formData.password,
        consent_given: agreed,
        age: age,
        gender: formData.gender ? Number(formData.gender) : undefined,
        medications: medicationsArray.length > 0 ? medicationsArray : undefined,
        chronicConditions:
          chronicConditionsArray.length > 0
            ? chronicConditionsArray
            : undefined,
      })
      navigate({ to: '/dashboard/overview' })
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Signup failed',
      })
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-600">Afya Smart</h1>
          <p className="text-slate-600 mt-2">Smart Health Monitoring System</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Create Account
          </h2>
          <p className="text-slate-600 mb-6">
            Join us to start monitoring your health
          </p>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-300' : 'border-slate-300'
                  }`}
                  required
                />
                {errors.fullName && (
                  <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+254712345678"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.phoneNumber ? 'border-red-300' : 'border-slate-300'
                  }`}
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Date of Birth *
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-slate-300'
                  }`}
                  required
                />
                {errors.dateOfBirth && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                  <option value="2">Other</option>
                </select>
              </div>

              {/* Medications */}
              <div>
                <label
                  htmlFor="medications"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Current Medications (comma-separated)
                </label>
                <input
                  id="medications"
                  type="text"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  placeholder="Lisinopril 10mg, Metformin 500mg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter medications separated by commas
                </p>
              </div>

              {/* Chronic Conditions */}
              <div>
                <label
                  htmlFor="chronicConditions"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Chronic Conditions (comma-separated)
                </label>
                <input
                  id="chronicConditions"
                  type="text"
                  name="chronicConditions"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  placeholder="Hypertension, Type 2 Diabetes"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter chronic conditions separated by commas
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-slate-300'
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.confirmPassword
                      ? 'border-red-300'
                      : 'border-slate-300'
                  }`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start mt-6">
              <input
                id="agreed"
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked)
                  if (errors.agreed) {
                    setErrors((prev) => ({
                      ...prev,
                      agreed: '',
                    }))
                  }
                }}
                className="mt-1 rounded focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor="agreed" className="ml-2 text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-teal-600 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-teal-600 hover:underline">
                  Privacy Policy
                </a>
                *
              </label>
            </div>
            {errors.agreed && (
              <p className="text-red-600 text-xs">{errors.agreed}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate({ to: '/login' })}
                className="text-teal-600 font-semibold hover:underline transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
