import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './DataViz.module.css'
import BorderGlow from '../BorderGlow/BorderGlow'
import AnimeDetail from '../Anime/AnimeDetail'
import TravelDetail from '../Travel/TravelDetail'
import GameDetail from '../Game/GameDetail'
import GameDetailA from '../Game/GameDetailA'
import LifeDetail from '../Life/LifeDetail'
import { asset } from '../../utils/asset'

/* 切换此常量来对比两个方案：'A' = 方案A，'B' = 方案B */
const GAME_VERSION = 'B'

const categories = [
  {
    id: 'anime',
    num: '01',
    title: '追番',
    titleEn: 'Anime',
    desc: '看过的番剧、评分与标签',
    stat: '记录中',
    img: asset('/f5d6e92d96274663ca5f5d07855c5ff26ce242a8.jpg@1192w.webp'),
    imgPosition: 'center center',
  },
  {
    id: 'game',
    num: '02',
    title: '游戏',
    titleEn: 'Games',
    desc: '玩过的游戏与时长分布',
    stat: '记录中',
    img: asset('/warthunder.webp'),
    imgPosition: 'center center',
  },
  {
    id: 'travel',
    num: '03',
    title: '旅游',
    titleEn: 'Travel',
    desc: '去过的城市与足迹地图',
    stat: '记录中',
    img: asset('/微信图片_20260617205506_313_115.jpg'),
    imgPosition: 'center 20%',
  },
  {
    id: 'life',
    num: '04',
    title: '生活',
    titleEn: 'Life',
    desc: '时间分配与日常数据',
    stat: '记录中',
    img: asset('/微信图片_20260617210758_314_115.jpg'),
    imgPosition: 'center center',
  },
]

export default function DataViz() {
  const sectionRef = useRef(null)
  const labelRef   = useRef(null)
  const headingRef = useRef(null)
  const gridRef    = useRef(null)
  const wrapRefs   = useRef([])
  const [activePane, setActivePane] = useState(null)   // 'anime' | 'game' | 'travel' | 'life'

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Section label "DATA"：大幅缩放归位
      gsap.from(labelRef.current, {
        scale: 4, opacity: 0, x: -16,
        transformOrigin: 'left center',
        duration: 1.5, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true }
      })

      // Section heading：上升淡入
      gsap.from(headingRef.current.children, {
        y: 45, opacity: 0,
        stagger: 0.12, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true }
      })

      // 卡片 stagger（带 clip-path reveal）
      gsap.from(wrapRefs.current.filter(Boolean), {
        y: 55, opacity: 0, scale: 0.96,
        stagger: 0.14, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="data" className={styles.section} ref={sectionRef}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.sectionLabel} ref={labelRef}>
          <span className={styles.labelLine} />
          <span>Data</span>
        </div>

        <div className={styles.heading} ref={headingRef}>
          <h2 className={styles.title}>我的数据小馆</h2>
          <p className={styles.subtitle}>选择一个分类，探索我的个人数据</p>
        </div>

        <div className={styles.grid} ref={gridRef}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              ref={(el) => (wrapRefs.current[i] = el)}
              className={styles.cardWrap}
              style={{ '--i': i }}
            >
              <BorderGlow
                backgroundColor="rgba(17, 17, 32, 0.72)"
                borderRadius={6}
                glowColor="210 80 65"
                glowRadius={36}
                glowIntensity={1.1}
                coneSpread={22}
                edgeSensitivity={28}
                colors={['#4f9eff', '#7eb8ff', '#a8d4ff']}
                fillOpacity={0.25}
                className={styles.glowCard}
              >
                <button
                  className={styles.cardBtn}
                  onClick={() => setActivePane(cat.id)}
                  aria-label={`查看${cat.title}数据`}
                >
                  {/* 左侧文字内容 */}
                  <div className={styles.cardInner}>
                    <div className={styles.cardTop}>
                      <span className={styles.numFg}>{cat.num}</span>
                      <span className={styles.cardEn}>{cat.titleEn}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{cat.title}</h3>
                    <p className={styles.cardDesc}>{cat.desc}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.statDot} />
                      <span className={styles.stat}>{cat.stat}</span>
                      <span className={styles.arrow}>→</span>
                    </div>
                  </div>

                  {/* 右侧图片区：图片 + 左边斜切蒙版 + 数字编号 */}
                  <div className={styles.cardImgPanel}>
                    <div
                      className={styles.cardImgBg}
                      style={{
                        backgroundImage: `url(${cat.img})`,
                        backgroundPosition: cat.imgPosition,
                      }}
                    />
                    <div className={styles.cardImgMask} />
                    <span className={styles.numBg}>{cat.num}</span>
                  </div>

                  {/* 底部渐变光条 */}
                  <span className={styles.bottomGlow} />
                </button>
              </BorderGlow>
            </div>
          ))}
        </div>
      </div>

      {/* 详情 overlay */}
      {activePane === 'anime' && (
        <AnimeDetail onClose={() => setActivePane(null)} />
      )}
      {activePane === 'travel' && (
        <TravelDetail onClose={() => setActivePane(null)} />
      )}
      {activePane === 'game' && GAME_VERSION === 'A' && (
        <GameDetailA onClose={() => setActivePane(null)} />
      )}
      {activePane === 'game' && GAME_VERSION === 'B' && (
        <GameDetail onClose={() => setActivePane(null)} />
      )}
      {activePane === 'life' && (
        <LifeDetail onClose={() => setActivePane(null)} />
      )}
    </section>
  )
}
