import { useAlerts } from '@/hooks/useVitals'
import { useAlertStore } from '@/store/alerts'
import type { AlertSeverity } from '@/types/dashboard'
import { AlertTriangle, Check, Trash2 } from 'lucide-react'
import { useState } from 'react'

function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts()
  const { markAsRead, clearAlert } = useAlertStore()
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>(
    'all',
  )

  const filteredAlerts =
    severityFilter === 'all'
      ? alerts
      : alerts?.filter((alert) => alert.severity === severityFilter)

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleClearAlert = (id: string) => {
    clearAlert(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Alerts</h1>
        <p className="text-slate-600 mt-2">
          Total: <span className="font-semibold">{alerts?.length || 0}</span>{' '}
          alert
          {alerts && alerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'critical', 'warning', 'info'] as const).map((severity) => (
          <button
            key={severity}
            onClick={() => setSeverityFilter(severity)}
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
              severityFilter === severity
                ? 'bg-teal-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-slate-500">
            Loading alerts...
          </div>
        ) : filteredAlerts && filteredAlerts.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 hover:bg-slate-50 transition duration-200 border-l-4 ${
                  alert.severity === 'critical'
                    ? 'border-l-red-600'
                    : alert.severity === 'warning'
                      ? 'border-l-yellow-600'
                      : 'border-l-blue-600'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-lg mt-0 ${
                        alert.severity === 'critical'
                          ? 'bg-red-100'
                          : alert.severity === 'warning'
                            ? 'bg-yellow-100'
                            : 'bg-blue-100'
                      }`}
                    >
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          alert.severity === 'critical'
                            ? 'text-red-600'
                            : alert.severity === 'warning'
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">
                          {alert.vital}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            alert.severity === 'critical'
                              ? 'bg-red-100 text-red-700'
                              : alert.severity === 'warning'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                        {!alert.isRead && (
                          <span className="inline-block w-2 h-2 bg-teal-600 rounded-full"></span>
                        )}
                      </div>

                      <p className="text-slate-600 text-sm mt-1">
                        {alert.message}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                        <div>
                          <p className="text-slate-500">Current Value</p>
                          <p className="font-semibold text-slate-900">
                            {alert.value} {alert.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Threshold</p>
                          <p className="font-semibold text-slate-900">
                            {alert.direction === 'above' ? '>' : '<'}{' '}
                            {alert.threshold} {alert.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Direction</p>
                          <p className="font-semibold text-slate-900 capitalize">
                            {alert.direction}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Time</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {alert.smsSent && (
                        <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700 border border-green-200">
                          ✓ SMS notification sent to{' '}
                          {alert.smsRecipients.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    {!alert.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="p-2 hover:bg-slate-200 rounded-lg transition duration-200"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-slate-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleClearAlert(alert.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition duration-200"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500">No alerts found</div>
        )}
      </div>

      {/* Alert Statistics */}
      {alerts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-red-700 text-sm font-medium">Critical Alerts</p>
            <p className="text-3xl font-bold text-red-900 mt-2">
              {alerts.filter((a) => a.severity === 'critical').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <p className="text-yellow-700 text-sm font-medium">
              Warning Alerts
            </p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">
              {alerts.filter((a) => a.severity === 'warning').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-blue-700 text-sm font-medium">Info Alerts</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {alerts.filter((a) => a.severity === 'info').length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertsPage
