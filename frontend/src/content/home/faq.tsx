import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How secure is patient data on VITALIS?',
    answer:
      'VITALIS uses 256-bit AES encryption for all data in transit and at rest. We are HIPAA compliant, SOC 2 Type II certified, and maintain comprehensive audit trails. Your data security is our top priority.',
  },
  {
    id: '2',
    question: 'How quickly can we integrate VITALIS with existing systems?',
    answer:
      'Most healthcare systems can integrate VITALIS within 2-4 weeks. We support HL7, FHIR, and custom API integrations. Our technical team provides full support throughout the implementation process.',
  },
  {
    id: '3',
    question: 'What devices and sensors are compatible?',
    answer:
      'VITALIS supports 150+ medical devices including ECG monitors, blood pressure cuffs, glucose meters, pulse oximeters, and most major wearable brands. Our compatibility list is constantly growing.',
  },
  {
    id: '4',
    question: 'Can VITALIS handle our patient volume?',
    answer:
      'Yes. VITALIS is built on cloud infrastructure that scales automatically. We currently support hospitals and clinics with patient volumes from hundreds to hundreds of thousands.',
  },
  {
    id: '5',
    question: 'What kind of training do our staff need?',
    answer:
      'We provide comprehensive onboarding and training for your team. Most clinicians become proficient within a few hours of interactive training. We offer ongoing support and quarterly webinars.',
  },
  {
    id: '6',
    question: 'What is your customer support like?',
    answer:
      'We offer 24/7 technical support with guaranteed response times. Enterprise customers get a dedicated account manager and priority support queue.',
  },
]

export function FAQ(): JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section
      className="z-20 w-full border-t border-slate-100 relative bg-white py-24"
      id="faq"
    >
      <div className="px-6 lg:px-[6%] max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about VITALIS
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <span className="font-semibold text-slate-900 text-left">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-slate-600 flex-shrink-0 transition ${
                    expandedId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === item.id && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <p className="text-slate-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
