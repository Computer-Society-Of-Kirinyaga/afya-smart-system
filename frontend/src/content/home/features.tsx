import { Activity, BarChart3, Bell, Lock, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    description:
      'Continuous health tracking with instant alerts for critical changes',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'AI-powered alerts prioritize critical events automatically',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive visualizations and trend analysis',
  },
  {
    icon: Lock,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security with full compliance',
  },
  {
    icon: Zap,
    title: 'Fast Integration',
    description: 'Connect existing devices and systems in minutes',
  },
  {
    icon: Users,
    title: 'Collaboration Tools',
    description: 'Enable seamless team communication and handoffs',
  },
]

export function Features(): JSX.Element {
  return (
    <section
      className="lg:py-32 bg-slate-50/50 w-full z-10 border-slate-100 border-t pt-24 pb-24 relative"
      id="features"
    >
      <div className="px-6 lg:px-[6%] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to deliver exceptional patient care
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg border border-slate-200 p-8 hover:shadow-lg transition"
            >
              <feature.icon className="w-8 h-8 text-sky-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
