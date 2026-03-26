import Header from '#/components/Header'
import { Architecture } from '#/content/home/architecture'
import { CTA } from '#/content/home/cta'
import { FAQ } from '#/content/home/faq'
import { Features } from '#/content/home/features'
import { Footer } from '#/content/home/footer'
import { Hero } from '#/content/home/hero'
import { Problem } from '#/content/home/problem'
import { Solution } from '#/content/home/solution'
import { Testimonials } from '#/content/home/testimonials'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Architecture />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}
