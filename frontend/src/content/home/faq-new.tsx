'use client'

import { useState } from 'react'

export function FAQNew() {
  return (
    <section id="faq" className="z-20 w-full border-t border-slate-100 relative bg-white">
      <div className="lg:px-[6%] max-w-[1600px] mr-auto ml-auto pr-6 pl-6 pt-24 pb-24">
        <div className="max-w-3xl">
          <h3 className="text-xs font-mono text-slate-500 uppercase mb-8">
            Common Questions
          </h3>
          <div className="space-y-0">
            <FAQItem question="Which wearables are compatible with HealthRisk AI?" answer="HealthRisk AI works with Apple Health, Fitbit, Garmin, Oura Ring, and other major health platforms. You can connect any wearable device that syncs with these platforms to start getting AI-powered insights." />
            <FAQItem
              question="How accurate is the risk prediction?"
              answer="Our machine learning models achieve 92% accuracy in early risk detection. The AI learns from millions of health data points and is continuously improving. Individual accuracy varies based on data quality and personal health factors."
            />
            <FAQItem
              question="Can my doctor see my data?"
              answer="Yes! You can securely share your health insights with your healthcare provider directly through HealthRisk AI. Your doctor receives real-time alerts about critical changes, and you maintain full control over what data is shared."
            />
            <FAQItem
              question="Is my data encrypted and private?"
              answer="Absolutely. HealthRisk AI uses AES-256 encryption for data at rest and TLS 1.3 for data in transit. We process data anonymously before running AI analysis, and you have complete control over your data access through our privacy settings."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="group border-b border-slate-100">
      <button
        className="w-full pt-6 pb-6 flex items-center justify-between cursor-pointer text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
          {question}
        </h3>
        <span
          className={`iconify w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors transform ${
            isOpen ? 'rotate-45' : ''
          }`}
          data-icon="solar:add-circle-linear"
        ></span>
      </button>
      {isOpen && (
        <div className="pb-8 text-slate-500 font-light leading-relaxed animate-reveal">
          {answer}
        </div>
      )}
    </div>
  )
}
