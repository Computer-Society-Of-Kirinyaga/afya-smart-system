import { useUpdateUserDoctor, useUpdateUserPreferences, useUser } from '@/hooks/useUsersApi'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'
import { Bell, Phone, Save, Stethoscope } from 'lucide-react'
import { useEffect, useState } from 'react'

function SettingsPage() {
  const { user } = useAuthStore()
  const userId = user?.id

  const { data: userData, isLoading } = useUser(userId || '')

  const updateDoctor = useUpdateUserDoctor(userId || '')
  const updatePreferences = useUpdateUserPreferences(userId || '')

  // Doctor info
  const [doctorName, setDoctorName] = useState('')
  const [doctorPhone, setDoctorPhone] = useState('')

  // Alert preferences — matches API shape exactly
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [alertDoctor, setAlertDoctor] = useState(false)
  const [riskThreshold, setRiskThreshold] = useState<'low' | 'medium' | 'high'>('medium')

  const [doctorSaved, setDoctorSaved] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)

  const { smsEnabled: toastsEnabled, toggleToasts } = useSettingsStore()

  useEffect(() => {
    if (userData) {
      setDoctorName(userData.doctor_name || '')
      setDoctorPhone(userData.doctor_phone_number || '')

      if (userData.alert_preferences) {
        setSmsEnabled(userData.alert_preferences.sms_enabled ?? true)
        setAlertDoctor(userData.alert_preferences.alert_doctor ?? false)
        setRiskThreshold(userData.alert_preferences.risk_threshold ?? 'medium')
      }
    }
  }, [userData])

  const handleSaveDoctor = async () => {
    try {
      await updateDoctor.mutateAsync({
        doctor_name: doctorName,
        doctor_phone_number: doctorPhone,
      })
      setDoctorSaved(true)
      setTimeout(() => setDoctorSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save doctor info:', error)
    }
  }

  const handleSavePreferences = async () => {
    try {
      await updatePreferences.mutateAsync({
        sms_enabled: smsEnabled,
        risk_threshold: riskThreshold,
        alert_doctor: alertDoctor,
      })
      setPrefsSaved(true)
      setTimeout(() => setPrefsSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load user data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your preferences and contact information
        </p>
      </div>

      {/* Account Info (read-only) */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-slate-900">Account Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 font-medium mb-1">Name</p>
            <p className="text-slate-900 font-semibold">{userData.name}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium mb-1">Phone Number</p>
            <p className="text-slate-900 font-semibold">{userData.phone_number}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium mb-1">Member Since</p>
            <p className="text-slate-900 font-semibold">
              {new Date(userData.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-slate-500 font-medium mb-1">Consent Given</p>
            <p className={`font-semibold ${userData.consent_given ? 'text-green-600' : 'text-red-600'}`}>
              {userData.consent_given ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Stethoscope className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-slate-900">Doctor Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Doctor's Name
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Dr. Kamau"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Doctor's Phone Number
            </label>
            <input
              type="tel"
              value={doctorPhone}
              onChange={(e) => setDoctorPhone(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="+254721000000"
            />
          </div>

          <button
            onClick={handleSaveDoctor}
            disabled={updateDoctor.isPending}
            className="w-full mt-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
          >
            <Save className="w-4 h-4" />
            {updateDoctor.isPending ? 'Saving...' : 'Save Doctor Info'}
          </button>

          {doctorSaved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✓ Doctor information saved successfully
            </div>
          )}
        </div>
      </div>

      {/* Alert Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-slate-900">Alert Preferences</h2>
        </div>

        <div className="space-y-4">
          {/* SMS Enabled */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">SMS Alerts</p>
              <p className="text-sm text-slate-600">Receive health alerts via SMS</p>
            </div>
            <button
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                smsEnabled ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  smsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Alert Doctor */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">Alert Doctor</p>
              <p className="text-sm text-slate-600">
                Notify your doctor when critical readings are detected
              </p>
            </div>
            <button
              onClick={() => setAlertDoctor(!alertDoctor)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                alertDoctor ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  alertDoctor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Risk Threshold */}
          <div className="p-4 border border-slate-200 rounded-lg">
            <p className="font-semibold text-slate-900 mb-1">Risk Threshold</p>
            <p className="text-sm text-slate-600 mb-3">
              Minimum risk level that triggers an alert
            </p>
            <div className="flex gap-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskThreshold(level)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition duration-200 ${
                    riskThreshold === level
                      ? level === 'low'
                        ? 'bg-green-600 text-white'
                        : level === 'medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-600 text-white'
                      : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={updatePreferences.isPending}
            className="w-full mt-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
          >
            <Save className="w-4 h-4" />
            {updatePreferences.isPending ? 'Saving...' : 'Save Alert Preferences'}
          </button>

          {prefsSaved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✓ Alert preferences saved successfully
            </div>
          )}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Push Notifications</h2>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <p className="font-semibold text-slate-900">Enable Toast Notifications</p>
            <p className="text-sm text-slate-600">Get in-app notifications for alerts</p>
          </div>
          <button
            onClick={toggleToasts}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              toastsEnabled ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                toastsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-600">App Version</p>
            <p className="font-semibold text-slate-900">1.0.0</p>
          </div>
          <div>
            <p className="text-slate-600">Last Updated</p>
            <p className="font-semibold text-slate-900">
              {new Date(userData.updated_at).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Data Storage</p>
            <p className="font-semibold text-slate-900">Cloud Sync Enabled</p>
          </div>
          <div>
            <p className="text-slate-600">Privacy Policy</p>
            <a href="#" className="font-semibold text-teal-600 hover:underline">
              Read Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
