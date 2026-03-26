export type Theme = 'light' | 'dark'

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar?: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface NavLink {
  label: string
  href: string
  isExternal?: boolean
}

export interface HeroContent {
  headline: string
  subheadline: string
  cta: {
    primary: { label: string; href: string }
    secondary: { label: string; href: string; isExternal?: boolean }
  }
}
