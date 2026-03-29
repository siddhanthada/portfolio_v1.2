import Hero from '@/components/sections/Hero'
import WorkStrip from '@/components/sections/WorkStrip'
import FeaturedWork from '@/components/sections/FeaturedWork'
import About from '@/components/sections/About'
import Philosophy from '@/components/sections/Philosophy'
import Experience from '@/components/sections/Experience'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkStrip />
      <FeaturedWork />
      <About />
      <Philosophy />
      <Experience />
      <Contact />
      <Footer />
    </main>
  )
}
