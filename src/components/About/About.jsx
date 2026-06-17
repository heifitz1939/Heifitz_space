import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'
import SJMAModal from './SJMAModal'
import { asset } from '../../utils/asset'

const tags = ['智能感知 24级', '二次元', '羽毛球', '军事爱好者']

const MILITARY_TAG = '军事爱好者'

const photos = [
  { src: asset('/avatar.jpg'),    pos: 'center center' },
  { src: asset('/gallery-1.jpg'), pos: 'center top'    },
  { src: asset('/gallery-3.jpg'), pos: 'center top'    },
  { src: asset('/gallery-4.jpg'), pos: 'center 18%'    },
]

export default function About() {
  const sectionRef    = useRef(null)
  const labelRef      = useRef(null)
  const leftRef       = useRef(null)
  const rightRef      = useRef(null)
  const filmstripRef  = useRef(null)
  const filmFramesRef = useRef(null)

  const [current, setCurrent] = useState(0)
  const [fading,  setFading]  = useState(false)
  const [scroll,  setScroll]  = useState({ left: 0, max: 0, ratio: 1 })

  // SJMA easter egg
  const [sjmaPhase,  setSjmaPhase]  = useState(null)  // null | 'consent' | 'refusing'
  const [sjmaScreen, setSjmaScreen] = useState(null)  // null | 'pitch' | 'intro'
  const hoverTimerRef  = useRef(null)
  const refuseTimerRef = useRef(null)

  const handleMilitaryEnter = () => {
    if (sjmaPhase || sjmaScreen) return
    hoverTimerRef.current = setTimeout(() => setSjmaPhase('consent'), 1000)
  }
  const handleMilitaryLeave = () => {
    clearTimeout(hoverTimerRef.current)
  }
  const handleConsent = () => { setSjmaPhase(null); setSjmaScreen('pitch') }
  const handleRefuse  = () => {
    setSjmaPhase('refusing')
    refuseTimerRef.current = setTimeout(() => { setSjmaPhase(null); setSjmaScreen('pitch') }, 1500)
  }

  useEffect(() => () => {
    clearTimeout(hoverTimerRef.current)
    clearTimeout(refuseTimerRef.current)
  }, [])

  const handleSwitch = (i) => {
    if (i === current) return
    setFading(true)
    setTimeout(() => { setCurrent(i); setFading(false) }, 130)
  }

  const updateScroll = () => {
    const el = filmFramesRef.current
    if (!el) return
    setScroll({
      left:  el.scrollLeft,
      max:   Math.max(0, el.scrollWidth - el.clientWidth),
      ratio: el.clientWidth / el.scrollWidth,
    })
  }

  useEffect(() => {
    const el = filmstripRef.current
    if (!el) return
    const onWheel = (e) => {
      if (!filmFramesRef.current) return
      e.preventDefault()
      filmFramesRef.current.scrollLeft += e.deltaY + e.deltaX
      updateScroll()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Section label "ABOUT"：从 4× 缩放归位（高端大标题进场）
      gsap.from(labelRef.current, {
        scale: 4, opacity: 0, x: -16,
        transformOrigin: 'left center',
        duration: 1.5, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true }
      })

      // 左列（头像）：从左滑入
      gsap.from(leftRef.current, {
        x: -70, opacity: 0,
        duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true }
      })

      // 右列：子元素依次 stagger 上升
      gsap.from(rightRef.current.children, {
        y: 40, opacity: 0,
        stagger: 0.13, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 58%', once: true }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleTrackClick = (e) => {
    const track = e.currentTarget
    const rect  = track.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    if (filmFramesRef.current) {
      filmFramesRef.current.scrollLeft = ratio * scroll.max
    }
  }

  const thumbWidth = Math.max(scroll.ratio * 100, 12)
  const thumbLeft  = scroll.max > 0
    ? (scroll.left / scroll.max) * (100 - thumbWidth)
    : 0

  return (
    <>
    <section id="about" className={styles.section} ref={sectionRef}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.sectionLabel} ref={labelRef}>
          <span className={styles.labelLine} />
          <span>About</span>
        </div>

        <div className={styles.grid}>
          {/* 左侧：头像 + 胶卷 */}
          <div className={styles.left} ref={leftRef}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarContainer}>
                <img
                  src={photos[current].src}
                  alt="Heifitz"
                  style={{ objectPosition: photos[current].pos }}
                  className={`${styles.avatarImg} ${fading ? styles.avatarFading : ''}`}
                />
                <div className={styles.avatarBorder} />

                {/* 胶卷条 */}
                <div className={styles.filmstrip} ref={filmstripRef}>
                  <div className={styles.filmstripInner}>
                    <div className={styles.filmHoles}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={styles.hole} />
                      ))}
                    </div>

                    <div
                      className={styles.filmFrames}
                      ref={filmFramesRef}
                      onScroll={updateScroll}
                    >
                      {photos.map(({ src }, i) => (
                        <button
                          key={i}
                          className={`${styles.frame} ${i === current ? styles.frameActive : ''}`}
                          onMouseEnter={() => handleSwitch(i)}
                          onClick={() => handleSwitch(i)}
                          aria-label={`切换到第 ${i + 1} 张照片`}
                        >
                          <img src={src} alt="" draggable={false} />
                          <span className={styles.frameIndex}>{String(i + 1).padStart(2, '0')}</span>
                        </button>
                      ))}
                    </div>

                    <div className={styles.filmHoles}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={styles.hole} />
                      ))}
                    </div>

                    {scroll.max > 0 && (
                      <div className={styles.scrollTrack} onClick={handleTrackClick}>
                        <div
                          className={styles.scrollThumb}
                          style={{ width: `${thumbWidth}%`, left: `${thumbLeft}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：文字 */}
          <div className={styles.right} ref={rightRef}>
            <div className={styles.tags}>
              {tags.map((tag) =>
                tag === MILITARY_TAG ? (
                  <span
                    key={tag}
                    className={`${styles.tag} ${styles.tagMilitary}`}
                    onMouseEnter={handleMilitaryEnter}
                    onMouseLeave={handleMilitaryLeave}
                  >
                    {tag}
                  </span>
                ) : (
                  <span key={tag} className={styles.tag}>{tag}</span>
                )
              )}
            </div>

            <h2 className={styles.heading}>
              你好，我是<span className={styles.accent}>海菲茨</span>
            </h2>

            <div className={styles.bio}>
              <p>上海交通大学智能感知工程专业 2024 级本科生。</p>
              <p>二次元爱好者，喜欢追番、看漫画，享受那些天马行空的故事。</p>
              <p>课余喜欢打羽毛球，也对军事有浓厚兴趣，从武器装备到战略战史都愿意钻研。</p>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>就读于</span>
                <span className={styles.metaValue}>上海交通大学</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>专业</span>
                <span className={styles.metaValue}>智能感知工程</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>状态</span>
                <span className={styles.metaValue}>
                  <span className={styles.dot} />
                  在读 · 2024 级
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── SJMA 军协彩蛋 consent 弹窗 ── */}
    {(sjmaPhase === 'consent' || sjmaPhase === 'refusing') && (
      <div className={styles.consentOverlay}>
        <div className={styles.consentCard}>
          {sjmaPhase === 'refusing' ? (
            <p className={styles.refuseMsg}>你没有拒绝的权力</p>
          ) : (
            <>
              <p className={styles.consentText}>观看本文字一秒钟则同意加入交大军协服役</p>
              <div className={styles.consentBtns}>
                <button className={styles.btnConfirm} onClick={handleConsent}>确定</button>
                <button className={styles.btnRefuse}  onClick={handleRefuse}>拒绝</button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* ── SJMA 全屏弹窗 ── */}
    {sjmaScreen && (
      <SJMAModal
        screen={sjmaScreen}
        onNext={() => setSjmaScreen('intro')}
        onClose={() => setSjmaScreen(null)}
      />
    )}
  </>
  )
}
