export interface Project {
  slug: string
  number: string
  name: string
  oneLiner: string
  tags: string[]
  gradient: string
  accentColor: string
  href?: string
}

export const projects: Project[] = [
  {
    slug: 'charts-modernisation',
    number: '01',
    name: 'Modernising Data Visualisation',
    oneLiner: 'Rebuilding the visual language of enterprise planning, one chart type at a time.',
    tags: ['Design Systems', 'Data Viz', 'Enterprise'],
    gradient: 'linear-gradient(135deg, #0A0A1A 0%, #0D1F3C 50%, #0A0A1A 100%)',
    accentColor: '#4A90E2',
    href: '/work/charts-modernisation',
  },
  {
    slug: 'locus-last-mile',
    number: '02',
    name: 'Locus Last Mile',
    oneLiner: 'A warehouse management dashboard for 661 orders, 22 riders, and one very important delivery.',
    tags: ['Product Design', 'B2B SaaS'],
    gradient: 'linear-gradient(135deg, #08080F 0%, #0D0A1F 50%, #08080F 100%)',
    accentColor: '#6366F1',
    href: '/work/locus-last-mile',
  },
  {
    slug: 'smart-cards',
    number: '03',
    name: 'Smart Cards',
    oneLiner: 'A mobile-first system for prime account holders to issue and manage supplementary cards for family members.',
    tags: ['Mobile', 'Fintech', '0 to 1'],
    gradient: 'linear-gradient(135deg, #080808 0%, #0A0A1F 50%, #080808 100%)',
    accentColor: '#6366F1',
    href: '/work/smart-cards',
  },
  {
    slug: 'customer-360',
    number: '04',
    name: 'Customer 360',
    oneLiner: 'Building LeadSquared\'s unified customer view from zero to shipped.',
    tags: ['Product Design', 'B2B SaaS', '0→1'],
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A0F0A 50%, #0A0A0A 100%)',
    accentColor: '#F97316',
    href: '/work/customer-360',
  },
]
