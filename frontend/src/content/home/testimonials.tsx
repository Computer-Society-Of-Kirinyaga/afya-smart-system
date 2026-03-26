import { useQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  hospital: string
  content: string
  rating: number
}

// Mock data for testimonials - in a real app, this would come from an API
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist',
    hospital: 'St. Mary\'s Medical Center',
    content:
      'VITALIS has transformed how we monitor our cardiac patients. The predictive alerts have helped us catch potential issues before they become emergencies.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Endocrinologist',
    hospital: 'City General Hospital',
    content:
      'The glucose monitoring integration is seamless. Our patients appreciate the ease of use, and we appreciate the actionable insights.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    role: 'ICU Director',
    hospital: 'Regional Medical Center',
    content:
      'Implementing VITALIS reduced our readmission rates by 23%. The ROI was evident within the first quarter.',
    rating: 5,
  },
]

function fetchTestimonials(): Promise<Testimonial[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTestimonials)
    }, 500)
  })
}

export function Testimonials(): JSX.Element {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
  })

  return (
    <section className="overflow-hidden lg:py-32 w-full z-20 pt-24 pb-24 relative bg-white" id="testimonials">
      <div className="px-6 lg:px-[6%] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Healthcare Leaders Trust Us
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hear from doctors and hospital administrators who are transforming patient care with VITALIS
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-slate-50 border border-slate-200 rounded-lg p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-6">"{testimonial.content}"</p>
                <div className="border-t border-slate-200 pt-4">
                  <div className="font-semibold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {testimonial.role}, {testimonial.hospital}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
