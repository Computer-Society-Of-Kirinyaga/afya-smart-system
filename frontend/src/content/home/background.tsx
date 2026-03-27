export function AmbientBackground() {
  return (
    <>
      {/* Background (Aura) */}
      <div
        className="aura-background-component top-0 w-full -z-10 absolute blur-md h-[700px]"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
        }}
      >
        <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
          <div className="absolute w-full h-full left-0 top-0 -z-10"></div>
        </div>
      </div>

      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] lg:w-[900px] h-[600px] lg:h-[900px] bg-sky-50 rounded-full blur-[80px] lg:blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] bg-teal-50 rounded-full blur-[80px] lg:blur-[120px] opacity-60"></div>
      </div>
    </>
  )
}

export function GlobalGridSystem() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none hidden lg:block h-screen">
      <div className="grid-line-v" style={{ left: 'var(--gx-1)' }}></div>
      <div className="grid-line-v" style={{ left: 'var(--gx-2)' }}>
        <div className="beam-v" style={{ animation: 'beam-v 6s infinite 1s' }}></div>
      </div>
      <div className="grid-line-v" style={{ left: 'var(--gx-3)' }}>
        <div className="beam-v" style={{ animation: 'beam-v 7s infinite 3s' }}></div>
      </div>
      <div className="grid-line-v" style={{ left: 'var(--gx-4)' }}></div>
      <div className="grid-line-h" style={{ top: 'var(--gy-1)' }}></div>
      <div className="grid-line-h" style={{ top: '35%' }}></div>
      <div className="grid-line-h" style={{ top: '75%' }}></div>
    </div>
  )
}
