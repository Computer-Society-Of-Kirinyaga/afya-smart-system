'use client'

import { useEffect } from 'react'
import { AmbientBackground, GlobalGridSystem } from './background'
import { FAQNew } from './faq-new'
import { FeaturesBento } from './features-bento'
import { FooterNew } from './footer-new'
import { HeroSection } from './hero-section'
import { ImpactSection } from './impact-section'
import { Navbar } from './navbar'
import { SharedStyles } from './shared-styles'
import { TestimonialsNew } from './testimonials-new'
import { CTA } from './cta'

export function HomePage() {
  useEffect(() => {
    // Initialize Iconify
    if (typeof window !== 'undefined' && window.Iconify) {
      window.Iconify.buildIcon('test')
    }

    // Initialize lucide icons
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons()
    }
  }, [])

  return (
    <div className="max-w-7xl w-full mx-auto">
      <SharedStyles />

      {/* Background (Aura) */}
      <AmbientBackground />

      {/* Global Grid System */}
      <GlobalGridSystem />

      {/* Navbar */}
      <Navbar />

      {/* Main Hero Section */}
      <HeroSection />

      {/* Impact Section */}
      <ImpactSection />

      {/* Features Section */}
      <FeaturesBento />

      {/* Testimonials Section */}
      <TestimonialsNew />

      {/* FAQ Section */}
      <FAQNew />

      {/* Call to Action Section */}
      <CTA />

      {/* Footer */}
      <FooterNew />

    </div>
  )
}
