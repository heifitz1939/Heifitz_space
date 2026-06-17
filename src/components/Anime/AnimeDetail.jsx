import { useEffect, useRef, useState } from 'react'
import RadarChart from './RadarChart'
import styles from './AnimeDetail.module.css'
import { asset } from '../../utils/asset'

/* ── 口味雷达数据（0-100） ── */
const TASTE = [
  { name: '热血',     value: 88 },
  { name: '治愈',     value: 65 },
  { name: '机甲/战争', value: 82 },
  { name: '奇幻冒险',  value: 78 },
  { name: '日常',     value: 45 },
  { name: '悬疑推理',  value: 70 },
]

/* ── 番剧数据 ── */
const ANIME_LIST = [
  {
    title: '86 不存在的战区',
    src: asset('/anime/86.jpeg'),
    year: 2021,
    score: 10,
    tags: ['机甲', '战争', '热血'],
    comment: '我心目中的神番。配乐和作画每集都是电影级别，战争与人性的碰撞让人窒息。',
  },
  {
    title: '葬送的芙莉莲',
    src: asset('/anime/frieren.jpeg'),
    year: 2023,
    score: 10,
    tags: ['奇幻', '治愈', '冒险'],
    comment: '作画非常精美，用慢节奏带来了不一样的感受，每一帧都是艺术。',
  },
  {
    title: 'Fate/Zero',
    src: asset('/anime/fatezero.jpeg'),
    year: 2011,
    score: 9,
    tags: ['战争', '奇幻', '悬疑'],
    comment: '正义的伙伴这一块，Kiritsugu的故事让人久久无法忘怀。',
  },
  {
    title: '死亡笔记',
    src: asset('/anime/deathnote.jpeg'),
    year: 2006,
    score: 7,
    tags: ['悬疑', '心理', '犯罪'],
    comment: '卡密！但结局剧情杀，前半段神作，后半段差强人意。',
  },
  {
    title: '刀剑神域',
    src: asset('/anime/sao.jpeg'),
    year: 2012,
    score: 10,
    tags: ['奇幻', '热血', '冒险'],
    comment: '入宅神作，当年看完直接打开了二次元的大门。',
  },
  {
    title: '某科学的超电磁炮',
    src: asset('/anime/railgun.jpg'),
    year: 2009,
    score: 9,
    tags: ['科幻', '热血', '日常'],
    comment: '算是入宅作之一，御坂美琴永远的神，学园都市的世界观太好了。',
  },
  {
    title: '判处勇者刑',
    src: asset('/anime/yuusha.jpeg'),
    year: 2024,
    score: 9,
    tags: ['奇幻', '热血', '战斗'],
    comment: '新番，但制作精美，剧情出乎意料的扎实，值得一追。',
  },
  {
    title: '斩赤红之瞳',
    src: asset('/anime/akame.jpeg'),
    year: 2014,
    score: 8,
    tags: ['热血', '战斗', '黑暗'],
    comment: '刚入二次元看这个番谁懂，当年第一次体验角色大量阵亡的震撼。',
  },
  {
    title: '百妖谱',
    src: asset('/anime/baiyaopu.jpeg'),
    year: 2022,
    score: 9,
    tags: ['治愈', '奇幻', '国漫'],
    comment: '百刀谱，剧情非常治愈（大嘘）。国漫中少见的古风妖怪题材精品。',
  },
  {
    title: '无名记忆',
    src: asset('/anime/unnamed.jpeg'),
    year: 2023,
    score: 9,
    tags: ['奇幻', '恋爱', '冒险'],
    comment: '好甜。男女主的互动让人心跳加速，世界观构建也相当完整。',
  },
  {
    title: '天才王子的赤字国家振兴术',
    src: asset('/anime/tensai.jpeg'),
    year: 2022,
    score: 9,
    tags: ['奇幻', '政治', '喜剧'],
    comment: '制作组赤字严重，但依旧很惊艳。王子的腹黑与无奈令人捧腹。',
  },
  {
    title: '咒术回战',
    src: asset('/anime/jjk.jpg'),
    year: 2020,
    score: 9,
    tags: ['热血', '战斗', '悬疑'],
    comment: '领域展开！作画天花板，如果不是漫画烂尾该多好。',
  },
  {
    title: '终结的炽天使',
    src: asset('/anime/seraph.jpeg'),
    year: 2015,
    score: 8,
    tags: ['热血', '战斗', '末世'],
    comment: '不赖，末世氛围和人物羁绊都做得挺到位的。',
  },
]

function StarScore({ score }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={i < score ? styles.starOn : styles.starOff}>★</span>
      ))}
      <span className={styles.scoreNum}>{score}/10</span>
    </div>
  )
}

export default function AnimeDetail({ onClose }) {
  const overlayRef = useRef(null)
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 300)
  }

  /* ESC 关闭 */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose() }}
    >
      <div className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}>
        {/* 关闭按钮 */}
        <button className={styles.closeBtn} onClick={handleClose} aria-label="关闭">✕</button>

        {/* 标题栏 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerLabel}>01 · ANIME</span>
            <h2 className={styles.headerTitle}>追番记录</h2>
            <p className={styles.headerSub}>共 {ANIME_LIST.length} 部 · 口味偏向机甲与战争</p>
          </div>
        </div>

        {/* 主体：雷达图 + 卡片墙 */}
        <div className={styles.body}>
          {/* 左栏：雷达图 */}
          <div className={styles.sidebar}>
            <p className={styles.sideTitle}>口味雷达</p>
            <RadarChart axes={TASTE} />
            <div className={styles.tasteList}>
              {TASTE.map((t) => (
                <div key={t.name} className={styles.tasteRow}>
                  <span className={styles.tasteName}>{t.name}</span>
                  <div className={styles.tasteBar}>
                    <div
                      className={styles.tasteBarFill}
                      style={{ width: `${t.value}%` }}
                    />
                  </div>
                  <span className={styles.tasteVal}>{t.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右栏：番剧卡片 */}
          <div className={styles.cardScroll}>
            <div className={styles.cardGrid}>
            {ANIME_LIST.map((a, i) => (
              <div key={a.title} className={styles.animeCard} style={{ '--idx': i }}>
                <div className={styles.coverWrap}>
                  <img src={a.src} alt={a.title} className={styles.cover} />
                  <div className={styles.coverOverlay} />
                  <div className={styles.tagRow}>
                    {a.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.year}>{a.year}</span>
                  </div>
                  <h3 className={styles.animeTitle}>{a.title}</h3>
                  <StarScore score={a.score} />
                  <p className={styles.comment}>"{a.comment}"</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
