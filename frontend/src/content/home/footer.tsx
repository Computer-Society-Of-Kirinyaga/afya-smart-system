import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-100 bg-slate-50 z-20 pt-24 pb-12">
      <div className="px-6 lg:px-[6%] max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold text-slate-900">VITALIS</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Revolutionizing patient care through intelligent monitoring.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-sky-600 transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-sky-600 transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-sky-600 transition"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:hello@vitalis.io"
                className="text-slate-500 hover:text-sky-600 transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <nav className="space-y-2">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Features
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Security
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Roadmap
              </a>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <nav className="space-y-2">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Careers
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <nav className="space-y-2">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Compliance
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 text-sm block transition"
              >
                Certifications
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © 2024 VITALIS. All rights reserved. Made with ❤️ for healthcare.
          </p>
          <div className="flex gap-8 text-sm">
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Status
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              API Docs
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
