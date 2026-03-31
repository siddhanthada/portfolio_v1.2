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
    name: 'Charts Modernisation',
    oneLiner: 'Migrating jqPlot to Highcharts for Fortune 100 planning workflows.',
    tags: ['Design Systems', 'Data Viz', 'Enterprise'],
    gradient: 'linear-gradient(135deg, #0A0A1A 0%, #0D1F3C 50%, #0A0A1A 100%)',
    accentColor: '#4A90E2',
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
    slug: 'gantt-chart',
    number: '03',
    name: 'Gantt Chart UX',
    oneLiner: 'Drag-and-drop rescheduling and process linking for complex supply chains.',
    tags: ['Interaction Design', 'Enterprise', 'UX'],
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #0A1A10 50%, #0A0A0A 100%)',
    accentColor: '#22C55E',
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
