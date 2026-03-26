import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="w-full relative z-10 bg-linear-to-r from-sky-600 to-teal-600 text-white py-24">
      <div className="px-6 lg:px-[6%] max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Ready to Transform Patient Care?
        </h2>
        <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
          Join hundreds of healthcare institutions using VITALIS to deliver better outcomes and reduce costs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-full bg-white text-sky-600 font-semibold hover:bg-sky-50 transition flex items-center justify-center gap-2">
            Start Free Trial <ArrowRight size={20} />
          </button>
          <button className="px-8 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/10 transition">
            Schedule Demo
          </button>
        </div>

        <p className="text-sky-100 mt-8 text-sm">
          No credit card required. 14-day free trial. Full access to all features.
        </p>
      </div>
    </section>
  )
}
