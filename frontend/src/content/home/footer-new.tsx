export function FooterNew() {
  return (
    <footer className="relative w-full border-t border-slate-100 bg-slate-50 z-20 pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 text-slate-900 mb-6">
              <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded flex items-center justify-center">
                <span className="iconify w-3.5 h-3.5" data-icon="solar:heart-pulse-linear"></span>
              </div>
              <span className="font-bold tracking-tight">Afya Smart</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI-powered health monitoring platform that predicts risks and prevents emergencies.
            </p>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              {['Features', 'How It Works', 'Pricing', 'Security'].map((item) => (
                <li key={item}>
                  <a className="text-sm text-slate-500 hover:text-teal-600 transition-colors" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {['About', 'Blog', 'Contact', 'Privacy'].map((item) => (
                <li key={item}>
                  <a className="text-sm text-slate-500 hover:text-teal-600 transition-colors" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 lg:justify-end items-start">
            <div className="bg-white border border-slate-200 p-6 rounded-sm w-full sm:w-64">
              <span className="block text-xs font-mono text-slate-400 mb-2">
                CONTACT US
              </span>
              <span className="block text-lg font-semibold text-slate-900 mb-1">
                support@healthriskai.com
              </span>
              <span className="block text-sm text-slate-500">Rapid response team</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-4">
          <p className="text-xs text-slate-400">
            © 2024 Afya Smart. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a className="text-slate-400 hover:text-slate-600 transition-colors" href="#">
              <span className="iconify w-4 h-4" data-icon="ri:twitter-x-line"></span>
            </a>
            <a className="text-slate-400 hover:text-slate-600 transition-colors" href="#">
              <span className="iconify w-4 h-4" data-icon="ri:facebook-circle-line"></span>
            </a>
            <a className="text-slate-400 hover:text-slate-600 transition-colors" href="#">
              <span className="iconify w-4 h-4" data-icon="ri:instagram-line"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
