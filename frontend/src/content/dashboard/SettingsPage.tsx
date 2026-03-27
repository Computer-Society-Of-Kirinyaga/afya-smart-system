import { useUpdateUserDoctor, useUpdateUserPreferences, useUser } from '@/hooks/useUsersApi'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'
import { Bell, Phone, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

function SettingsPage() {
  const { user } = useAuthStore()
  const userId = user?.id

  // Fetch user data from backend
  const { data: userData, isLoading } = useUser(userId || '')

  // Mutations for updating user
  const updateDoctor = useUpdateUserDoctor(userId || '')
  const updatePreferences = useUpdateUserPreferences(userId || '')

  const [primaryPhone, setPrimaryPhone] = useState('')
  const [secondaryPhone, setSecondaryPhone] = useState('')
  const [email, setEmail] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [doctorPhone, setDoctorPhone] = useState('')
  const [smsEnabled, setSmsEnabled] = useState({ critical: true, warning: true, info: true })
  const [riskThreshold, setRiskThreshold] = useState<'low' | 'medium' | 'high'>('medium')
  const [alertDoctor, setAlertDoctor] = useState(false)
  const [saved, setSaved] = useState(false)

    const {
    smsEnabled: storeToastsEnabled,
    updateContacts,
    toggleToasts,
  } = useSettingsStore()

  // Populate form when user data loads
  useEffect(() => {
    if (userData) {
      setPrimaryPhone(userData.phone_number || '')
      setDoctorName(userData.doctor_name || '')
      setDoctorPhone(userData.doctor_phone_number || '')

      if (userData.alert_preferences) {
        setSmsEnabled(userData.alert_preferences.sms_enabled ?? true)
        setRiskThreshold(userData.alert_preferences.risk_threshold ?? 'medium')
        setAlertDoctor(userData.alert_preferences.alert_doctor ?? false)
      }
    }
  }, [userData])

  const handleSaveDoctor = async () => {
    try {
      await updateDoctor.mutateAsync({
        doctor_name: doctorName,
        doctor_phone_number: doctorPhone,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
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
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  const handleSaveContacts = async () => {
    try {
      updateContacts({
        primaryPhone,
        secondaryPhone,
        email,
        emergencyContact,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save contact info:', error)
    }
  }

  const updateSmsToggles = (newSmsSettings: typeof smsEnabled) => {
    setSmsEnabled(newSmsSettings)
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

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Contact Information
          </h2>
        </div>

        <div className="space-y-4">
          {/* Primary Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Primary Phone
            </label>
            <input
              type="tel"
              value={primaryPhone}
              onChange={(e) => setPrimaryPhone(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="+254712345678"
            />
          </div>

          {/* Secondary Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Secondary Phone (Optional)
            </label>
            <input
              type="tel"
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="+254798765432"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="jane@vitalis.io"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Emergency Contact Name
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveContacts}
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
          >
            <Save className="w-4 h-4" />
            Save Contact Information
          </button>

          {saved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✓ Contact information saved successfully
            </div>
          )}
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            SMS Notifications
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            Choose which alert types trigger SMS notifications to your primary
            phone
          </p>

          {/* Critical Alerts */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">Critical Alerts</p>
              <p className="text-sm text-slate-600">
                Life-threatening conditions
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsEnabled.critical}
              onChange={() =>
                updateSmsToggles({
                  ...smsEnabled,
                  critical: !smsEnabled.critical,
                })
              }
              className="w-6 h-6 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Warning Alerts */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">Warning Alerts</p>
              <p className="text-sm text-slate-600">
                Elevated readings requiring attention
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsEnabled.warning}
              onChange={() =>
                updateSmsToggles({
                  ...smsEnabled,
                  warning: !smsEnabled.warning,
                })
              }
              className="w-6 h-6 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Info Alerts */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">Info Alerts</p>
              <p className="text-sm text-slate-600">
                General information and reminders
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsEnabled.info}
              onChange={() =>
                updateSmsToggles({
                  ...smsEnabled,
                  info: !smsEnabled.info,
                })
              }
              className="w-6 h-6 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Push Notifications
          </h2>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <p className="font-semibold text-slate-900">
              Enable Toast Notifications
            </p>
            <p className="text-sm text-slate-600">
              Get in-app notifications for alerts
            </p>
          </div>
          <input
            type="checkbox"
            checked={storeToastsEnabled}
            onChange={toggleToasts}
            className="w-6 h-6 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* System Information */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          System Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-600">App Version</p>
            <p className="font-semibold text-slate-900">1.0.0</p>
          </div>
          <div>
            <p className="text-slate-600">Last Sync</p>
            <p className="font-semibold text-slate-900">Just now</p>
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
