import { useEffect, useRef, useState } from 'react'
import styles from './AnimeDetailA.module.css'

const ANIME_LIST = [
  {
    title: '机动战士高达：水星的魔女',
    src: 'https://cdn.myanimelist.net/images/anime/1530/123329.jpg',
    year: 2022,
    score: 9,
    tags: ['机甲', '战争', '百合'],
    comment: '近年高达最佳，剧情反转拉满，苏莱塔永远是我的神明。',
  },
  {
    title: '进击的巨人 最终季',
    src: 'https://cdn.myanimelist.net/images/anime/1773/122988.jpg',
    year: 2020,
    score: 10,
    tags: ['热血', '战争', '悬疑'],
    comment: '没有对错，只有立场。能把战争写得这么沉重的动画寥寥无几。',
  },
  {
    title: '86-不存在的战区-',
    src: 'https://cdn.myanimelist.net/images/anime/1987/117507.jpg',
    year: 2021,
    score: 9,
    tags: ['机甲', '战争', '热血'],
    comment: '两季都是神作，配乐和作画每集都是电影级别的享受。',
  },
  {
    title: '孤独摇滚！',
    src: 'https://cdn.myanimelist.net/images/anime/1864/120681.jpg',
    year: 2022,
    score: 9,
    tags: ['日常', '音乐', '治愈'],
    comment: '波奇酱的成长史，也是所有社恐人的共鸣。OP神曲。',
  },
  {
    title: '葬送的芙莉莲',
    src: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    year: 2023,
    score: 10,
    tags: ['奇幻', '治愈', '冒险'],
    comment: '用慢节奏讲透了时间与告别，每一集都像在读一首散文诗。',
  },
  {
    title: 'BLEACH 千年血战篇',
    src: 'https://cdn.myanimelist.net/images/anime/1764/120376.jpg',
    year: 2022,
    score: 9,
    tags: ['热血', '战斗', '奇幻'],
    comment: '久违的死神回归，作画直接拉到顶，山本总队长那集封神。',
  },
  {
    title: '鬼灭之刃 刀匠村篇',
    src: 'https://cdn.myanimelist.net/images/anime/1273/135088.jpg',
    year: 2023,
    score: 8,
    tags: ['热血', '战斗', '奇幻'],
    comment: '上弦之壹出场那一刻是全程最燃的五分钟，ufotable永远的神。',
  },
  {
    title: '间谍过家家',
    src: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
    year: 2022,
    score: 9,
    tags: ['喜剧', '日常', '动作'],
    comment: '阿尼亚把整部番撑起来了，每次看都能笑出声。',
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

export default function AnimeDetailA({ onClose }) {
  const overlayRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className={styles.panel}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">✕</button>

        <div className={styles.header}>
          <span className={styles.headerLabel}>01 · ANIME</span>
          <h2 className={styles.headerTitle}>追番记录</h2>
          <p className={styles.headerSub}>共 {ANIME_LIST.length} 部 · 悬浮卡片查看评语</p>
        </div>

        <div className={styles.body}>
          <div className={styles.cardGrid}>
            {ANIME_LIST.map((a, i) => (
              <div
                key={a.title}
                className={`${styles.card} ${hovered === i ? styles.cardHovered : ''}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ '--idx': i }}
              >
                {/* 封面 */}
                <div className={styles.coverWrap}>
                  <img src={a.src} alt={a.title} className={styles.cover} />
                  <div className={styles.coverOverlay} />
                </div>

                {/* 常驻底部信息 */}
                <div className={styles.cardFooter}>
                  <h3 className={styles.animeTitle}>{a.title}</h3>
                  <StarScore score={a.score} />
                </div>

                {/* 悬浮展开评语层 */}
                <div className={styles.hoverPanel}>
                  <div className={styles.hoverTop}>
                    <h3 className={styles.hoverTitle}>{a.title}</h3>
                    <span className={styles.hoverYear}>{a.year}</span>
                  </div>
                  <div className={styles.tagRow}>
                    {a.tags.map((t) => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                  <StarScore score={a.score} />
                  <p className={styles.comment}>"{a.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
