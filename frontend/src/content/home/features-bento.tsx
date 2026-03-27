'use client'


export function FeaturesBento() {
  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = (e.currentTarget as HTMLDivElement).children
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLDivElement
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', x + 'px')
      card.style.setProperty('--mouse-y', y + 'px')
    }
  }

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ;(e.currentTarget as HTMLDivElement).style.setProperty('--mouse-x', x + 'px')
    ;(e.currentTarget as HTMLDivElement).style.setProperty('--mouse-y', y + 'px')
  }

  return (
    <section className="lg:py-32 bg-slate-50/50 w-full z-10 border-slate-100 border-t pt-24 pb-24 relative">
      <div className="absolute inset-0 pointer-events-none hidden lg:block z-0">
        <div className="absolute top-0 bottom-0 left-[6%] w-[1px] bg-slate-200/50"></div>
        <div className="absolute top-0 bottom-0 left-[28%] w-[1px] bg-slate-200/50"></div>
        <div className="absolute top-0 bottom-0 left-[62%] w-[1px] bg-slate-200/50"></div>
        <div className="absolute top-0 bottom-0 right-[6%] w-[1px] bg-slate-200/50"></div>
      </div>
      <div className="relative z-10 lg:px-[6%] max-w-[1600px] mr-auto ml-auto pr-6 pl-6">
        <div className="mb-20 lg:mb-24 max-w-4xl">
          <h2 className="lg:text-7xl text-4xl font-medium text-slate-900 tracking-tight mb-8 scroll-reveal">
            Holistic Health
            <span className="text-slate-300"> Infrastructure. </span>
          </h2>
          <div className="scroll-reveal delay-100 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              From primary care to advanced specialized treatments, VITALIS bridges the gap between patient comfort and medical innovation.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6" onMouseMove={handleGridMouseMove}>
          {/* Card 1 */}
          <FeatureCard
            delay="delay-200"
            colSpan="col-span-1 lg:col-span-2"
            icon="solar:stethoscope-linear"
            iconBg="bg-teal-50"
            iconColor="text-teal-600"
            title="Primary Care"
            description="Comprehensive annual checkups, preventative screenings, and personalized health plans."
            onMouseMove={handleCardMouseMove}
          />

          {/* Card 2 */}
          <FeatureCard
            delay="delay-300"
            colSpan="col-span-1 lg:col-span-2"
            icon="solar:document-medicine-linear"
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
            title="Digital Records"
            description="Secure, instant access to your medical history, lab results, and prescriptions via our portal."
            onMouseMove={handleCardMouseMove}
          />

          {/* Card 3 */}
          <FeatureCard
            delay="delay-500"
            colSpan="col-span-1 lg:col-span-2"
            icon="solar:test-tube-linear"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            title="Advanced Diagnostics"
            description="State-of-the-art imaging and on-site laboratory for rapid, accurate diagnosis."
            onMouseMove={handleCardMouseMove}
          />

          {/* Card 4: Wide */}
          <FeatureCardWide
            delay="delay-200"
            colSpan="col-span-1 lg:col-span-3"
            icon="solar:monitor-camera-linear"
            title="Telemedicine Integration"
            description="Connect with your doctor from the comfort of your home. High-definition video consultations allow for routine follow-ups without the commute."
            badges={['HIPAA Compliant', 'Encrypted Video']}
            onMouseMove={handleCardMouseMove}
          />

          {/* Card 5: Wide */}
          <FeatureCardWide
            delay="delay-300"
            colSpan="col-span-1 lg:col-span-3"
            icon="solar:users-group-two-rounded-linear"
            title="Specialist Network"
            description="Direct referrals to the top specialists in the region. Our coordinated care model ensures your entire medical team is on the same page."
            isMultiUser={true}
            onMouseMove={handleCardMouseMove}
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  delay: string
  colSpan: string
  icon: string
  iconBg: string
  iconColor: string
  title: string
  description: string
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
}

function FeatureCard({
  delay,
  colSpan,
  icon,
  iconBg,
  iconColor,
  title,
  description,
  onMouseMove,
}: FeatureCardProps) {
  return (
    <div
      className={`scroll-reveal ${delay} ${colSpan} group hover:bg-white transition-all duration-300 flex flex-col hover:border-slate-300 h-full border-slate-200 border rounded-sm p-8 relative bg-white/40 backdrop-blur-sm justify-between overflow-hidden shadow-sm hover:shadow-md`}
      onMouseMove={onMouseMove}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(15, 23, 42, 0.03), transparent 40%)',
          zIndex: 0,
        }}
      ></div>
      <div className={`h-12 w-12 ${iconBg} rounded-lg flex items-center justify-center ${iconColor} mb-8 relative z-10`}>
        <span className="iconify w-6 h-6" data-icon={icon}></span>
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 font-normal leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

interface FeatureCardWideProps {
  delay: string
  colSpan: string
  icon: string
  title: string
  description: string
  badges?: string[]
  isMultiUser?: boolean
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
}

function FeatureCardWide({
  delay,
  colSpan,
  icon,
  title,
  description,
  badges,
  isMultiUser,
  onMouseMove,
}: FeatureCardWideProps) {
  return (
    <div
      className={`scroll-reveal ${delay} ${colSpan} group hover:bg-white transition-all duration-300 flex flex-col min-h-[300px] hover:border-slate-300 border-slate-200 border rounded-sm p-8 relative bg-white/40 backdrop-blur-sm justify-between overflow-hidden shadow-sm hover:shadow-md`}
      onMouseMove={onMouseMove}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(15, 23, 42, 0.03), transparent 40%)',
          zIndex: 0,
        }}
      ></div>
      <div className={`absolute top-8 right-8 transition-colors ${icon === 'solar:users-group-two-rounded-linear' ? 'text-slate-200 group-hover:text-sky-100' : 'text-slate-200 group-hover:text-teal-100'}`}>
        <span className="iconify w-16 h-16" data-icon={icon}></span>
      </div>
      <div className="mt-auto relative z-10">
        <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 font-normal leading-relaxed max-w-md">{description}</p>
        <div className="mt-8">
          {badges ? (
            <div className="flex items-center gap-4">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className={`text-xs font-mono px-2 py-1 rounded ${
                    badge === 'HIPAA Compliant'
                      ? 'text-teal-700 bg-teal-50 border border-teal-100'
                      : 'text-slate-400'
                  }`}
                >
                  {badge}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex -space-x-2 overflow-hidden">
              <img
                alt=""
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
              />
              <img
                alt=""
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=2070&auto=format&fit=crop"
              />
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                +12
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
