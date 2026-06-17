import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './Hero.module.css'

export default function Hero() {
  const heroRef      = useRef(null)
  const headingRef   = useRef(null)
  const mainTitleRef = useRef(null)
  const subTitleRef  = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })

      // 1. 中心文字：遮罩从右向左揭开 + 轻微上升（位移）
      tl.fromTo(headingRef.current,
        { clipPath: 'inset(0 100% 0 0)', y: 18 },
        { clipPath: 'inset(0 0% 0 0)', y: 0, duration: 1.7, ease: 'power3.inOut' }
      )

      // 2. 主标题：字间距从宽到正常（压缩后归位）+ 上升
      tl.fromTo(mainTitleRef.current,
        { opacity: 0, y: 28, letterSpacing: '0.85em' },
        { opacity: 1, y: 0,  letterSpacing: '0.4em', duration: 1.5, ease: 'power3.out' },
        '-=0.85'
      )

      // 3. 副标题：淡入上升
      tl.fromTo(subTitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0,  duration: 1.0, ease: 'power2.out' },
        '-=0.9'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" className={styles.hero} ref={heroRef}>
      {/* 视频背景 */}
      <div className={styles.videoBg}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.video}
          poster=""
        >
          <source src="/video/bg.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay} />
      </div>

      {/* 中心艺术字 */}
      <div className={styles.centerText}>
        <h1 className={styles.centerHeading} ref={headingRef}>
          <span>飞吧，飞向春天</span>
        </h1>
      </div>

      {/* 底部居中文字 */}
      <div className={styles.bottomText}>
        <p className={styles.mainTitle} ref={mainTitleRef}>HEIFITZ · PERSONAL SPACE</p>
        <p className={styles.subTitle}  ref={subTitleRef}>YOUR_SLOGAN_HERE</p>
      </div>
    </section>
  )
}
