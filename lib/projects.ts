export interface Project {
  slug: string
  number: string
  name: string
  oneLiner: string
  tags: string[]
  gradient: string
  accentColor: string
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
    slug: 'icon-system',
    number: '02',
    name: 'Icon System Revamp',
    oneLiner: 'Redesigning 800+ icons from scratch with semantic rules and font delivery.',
    tags: ['Design Systems', 'Iconography', 'Scale'],
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A0A1A 50%, #0F0A0A 100%)',
    accentColor: '#A855F7',
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
  },
]
