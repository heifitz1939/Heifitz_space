import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Contact.module.css'

export default function Contact() {
  const sectionRef = useRef(null)
  const labelRef   = useRef(null)
  const headingRef = useRef(null)
  const subRef     = useRef(null)
  const linksRef   = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Section label "CONTACT"：大幅缩放归位
      gsap.from(labelRef.current, {
        scale: 4, opacity: 0, x: -16,
        transformOrigin: 'left center',
        duration: 1.5, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      })

      // 大标题"Let's connect."
      gsap.from(headingRef.current, {
        y: 60, opacity: 0,
        duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true }
      })

      // 副标题
      gsap.from(subRef.current, {
        y: 35, opacity: 0,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
        delay: 0.1
      })

      // 链接列表逐条 stagger
      gsap.from(linksRef.current.children, {
        x: -40, opacity: 0,
        stagger: 0.14, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className={styles.section} ref={sectionRef}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.sectionLabel} ref={labelRef}>
          <span className={styles.labelLine} />
          <span>Contact</span>
        </div>

        <div className={styles.content}>
          <h2 className={styles.heading} ref={headingRef}>Let's connect.</h2>
          <p className={styles.sub} ref={subRef}>
            Feel free to reach out — whether it's about collaboration, opportunities, or just a conversation.
          </p>
          <div className={styles.links} ref={linksRef}>
            <a href="mailto:1604663256@qq.com" className={styles.link}>
              <span className={styles.linkLabel}>Email</span>
              <span className={styles.linkValue}>1604663256@qq.com</span>
              <IconArrow />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>© {new Date().getFullYear()} HEIFITZ — All rights reserved.</span>
      </div>
    </section>
  )
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  )
}
