import { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import DataViz from './components/DataViz/DataViz'
import Contact from './components/Contact/Contact'

export default function App() {
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      // Hero 占满第一屏，滚过 30%~100% 的屏幕高度时背景逐渐显现
      const progress = Math.min(1, Math.max(0, (window.scrollY - vh * 0.3) / (vh * 0.7)))
      document.documentElement.style.setProperty('--bg-opacity', progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <DataViz />
        <Contact />
      </main>
    </>
  )
}
