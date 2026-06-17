import { useState, useEffect, useRef } from 'react'
import styles from './GameDetailA.module.css'

const CATEGORIES = [
  {
    id: 'gacha',
    name: '二次元',
    nameEn: 'Gacha / ACG',
    icon: '✦',
    desc: '手游、二游，以及那些让人肝到天亮的养成游戏',
    /* 背景渐变色 */
    bgGradient: 'linear-gradient(160deg, rgba(139,92,246,0.55) 0%, rgba(236,72,153,0.35) 100%)',
    accentColor: 'rgba(167,139,250,0.9)',
  },
  {
    id: 'war',
    name: '战争',
    nameEn: 'War / Strategy',
    icon: '⚔',
    desc: '坦克、飞机与步枪，钢铁与血肉在战场上交织',
    bgGradient: 'linear-gradient(160deg, rgba(245,158,11,0.45) 0%, rgba(239,68,68,0.35) 100%)',
    accentColor: 'rgba(251,191,36,0.9)',
  },
  {
    id: 'coop',
    name: '合作',
    nameEn: 'Co-op',
    icon: '⚡',
    desc: '和朋友并肩作战，笑声与尖叫声同样响亮',
    bgGradient: 'linear-gradient(160deg, rgba(16,185,129,0.45) 0%, rgba(59,130,246,0.35) 100%)',
    accentColor: 'rgba(52,211,153,0.9)',
  },
]

const GAMES = [
  { id: 'zzz',        cat: 'gacha', title: '绝区零',        year: 2024, hours: '200h+', tags: ['二次元','动作','米哈游'],    comment: '手感极佳的动作游戏，绳匠街的氛围感拉满，目前主力肝的手游。',             emoji: '⚡' },
  { id: 'starrail',   cat: 'gacha', title: '崩坏：星穹铁道', year: 2023, hours: '300h+', tags: ['二次元','回合制','米哈游'],  comment: '文案天花板，剧情一次次超出预期，仙舟、匹诺康尼篇章令人难忘。',           emoji: '🌌' },
  { id: 'genshin',    cat: 'gacha', title: '原神',           year: 2020, hours: '500h+', tags: ['二次元','开放世界','米哈游'], comment: '入坑手游的起点，提瓦特的世界广袤且细腻，只是肝度让人又爱又恨。',         emoji: '🌸' },
  { id: 'nikke',      cat: 'gacha', title: 'NIKKE',          year: 2022, hours: '100h+', tags: ['二次元','射击','韩国'],      comment: '剧情比外表深度高得多，后期主线堪称神作，配乐也顶。',                     emoji: '🔫' },
  { id: 'arknights',  cat: 'gacha', title: '明日方舟',        year: 2019, hours: '200h+', tags: ['二次元','塔防','策略'],      comment: '策略深度在手游中首屈一指，泰拉的世界观令人着迷，干员设计出彩。',         emoji: '🐻' },
  { id: 'wt',         cat: 'war',   title: '战争雷霆',        year: 2013, hours: '800h+', tags: ['战争','坦克','飞机'],        comment: '最还原的坦克飞机对战游戏，虽然毒瘤但就是戒不掉，科了不少坦。',           emoji: '🛡' },
  { id: 'hll',        cat: 'war',   title: '地狱放行',        year: 2021, hours: '150h+', tags: ['战争','射击','二战'],        comment: '最有代入感的二战步兵游戏，真实的战场混乱与团队配合缺一不可。',           emoji: '🪖' },
  { id: 'squad',      cat: 'war',   title: 'Squad',          year: 2020, hours: '80h+',  tags: ['战争','射击','现代'],        comment: '对讲机和工兵铲才是主角，真实的战术协同体验无可替代。',                   emoji: '📻' },
  { id: 'il2',        cat: 'war',   title: 'IL-2 风暴鸟',    year: 2014, hours: '60h+',  tags: ['战争','飞行','二战'],        comment: '最硬核的螺旋桨时代飞行模拟，每次起飞落地都是一次修行。',                 emoji: '✈' },
  { id: 'bf1',        cat: 'war',   title: '战地一',          year: 2016, hours: '120h+', tags: ['战争','射击','一战'],        comment: '开场动画每次都能起鸡皮疙瘩，一战背景下的战场氛围无可超越。',             emoji: '🎖' },
  { id: 'helldivers', cat: 'coop',  title: '地狱潜兵2',       year: 2024, hours: '120h+', tags: ['合作','射击','科幻'],        comment: '散布民主！最欢乐的四人合作射击，友军伤害带来无尽笑料与名场面。',         emoji: '🪐' },
  { id: 'lethal',     cat: 'coop',  title: '致命公司',        year: 2023, hours: '40h+',  tags: ['合作','恐怖','独立'],        comment: '凌晨三点和朋友一起被吓到尖叫的体验，廉价感反而成了最大魅力。',           emoji: '👾' },
  { id: 'deeprock',   cat: 'coop',  title: '深岩银河',        year: 2020, hours: '80h+',  tags: ['合作','射击','矿工'],        comment: '岩石与石头！设计最为良心的合作游戏之一，无毒无肝纯快乐。',               emoji: '⛏' },
]

/* 根据选中状态计算 grid-template-columns */
function buildCols(selectedIdx) {
  if (selectedIdx === null) return '1fr 1fr 1fr 0px'
  return CATEGORIES.map((_, i) =>
    i === selectedIdx ? '280px' : '0px'
  ).join(' ') + ' 1fr'
}

export default function GameDetailA({ onClose }) {
  const overlayRef   = useRef(null)
  const [closing,     setClosing]     = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(null)   /* null = 菜单，0/1/2 = 某分类 */
  const [activeCat,   setActiveCat]   = useState('gacha')
  const [gameVisible, setGameVisible] = useState(false)  /* 游戏列淡入延迟 */

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 300)
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  const handleCatClick = (idx) => {
    if (selectedIdx !== null) return   /* 已展开时不可重复点击分类 */
    setSelectedIdx(idx)
    setActiveCat(CATEGORIES[idx].id)
    /* 游戏列在 grid 展开动画完成后淡入 */
    setTimeout(() => setGameVisible(true), 380)
  }

  const handleBack = () => {
    setGameVisible(false)
    setTimeout(() => setSelectedIdx(null), 80)
  }

  const visibleGames = GAMES.filter((g) => g.cat === activeCat)
  const cols = buildCols(selectedIdx)

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose() }}
    >
      <div className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="关闭">✕</button>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerLabel}>02 · GAMES</span>
          <h2 className={styles.headerTitle}>游戏档案</h2>
          <p className={styles.headerSub}>{GAMES.length} 款游戏 · 跨越二次元、战场与星际</p>
        </div>

        {/* 四列 grid body */}
        <div className={styles.body} style={{ '--cols': cols }}>

          {/* 三个分类列 */}
          {CATEGORIES.map((cat, idx) => {
            const isSidebar = selectedIdx === idx
            const isHidden  = selectedIdx !== null && selectedIdx !== idx
            return (
              <div
                key={cat.id}
                className={`${styles.catCol} ${isSidebar ? styles.catColSidebar : ''}`}
                style={{ cursor: selectedIdx === null ? 'pointer' : 'default' }}
                onClick={() => selectedIdx === null && handleCatClick(idx)}
              >
                {/* 背景色块 */}
                <div className={styles.catColBg} style={{ background: cat.bgGradient }} />

                {/* 全屏展示内容（未选中时） */}
                {!isHidden && (
                  <div className={styles.catFull}>
                    <div className={styles.catBigIcon}
                         style={{ borderColor: cat.accentColor.replace('0.9','0.25'),
                                  color: cat.accentColor }}>
                      {cat.icon}
                    </div>
                    <div>
                      <div className={styles.catBigName}>{cat.name}</div>
                      <div className={styles.catBigNameEn}>{cat.nameEn}</div>
                    </div>
                    <div className={styles.catBigDesc}>{cat.desc}</div>
                    <div className={styles.catBigCount}
                         style={{ borderColor: cat.accentColor.replace('0.9','0.2'),
                                  color: cat.accentColor }}>
                      {GAMES.filter((g) => g.cat === cat.id).length} 款收录
                    </div>
                    <div className={styles.catEnterHint}>点击展开 ↓</div>
                  </div>
                )}

                {/* 侧边栏内容（选中后） */}
                <div className={styles.catSide}>
                  <div className={styles.catSideIcon}
                       style={{ color: cat.accentColor }}>{cat.icon}</div>
                  <div className={styles.catSideName}
                       style={{ color: cat.accentColor }}>{cat.name}</div>
                  <button className={styles.backBtn} onClick={handleBack}>返回</button>
                </div>
              </div>
            )
          })}

          {/* 游戏列（第 4 列） */}
          <div className={`${styles.gameCol} ${gameVisible ? styles.gameColVisible : ''}`}>
            {/* 分类标签 */}
            <div className={styles.gameCatTabs}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.gameCatTab} ${activeCat === cat.id ? styles.gameCatTabActive : ''}`}
                  onClick={() => setActiveCat(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* 游戏卡片网格 */}
            <div className={styles.gameScroll}>
              <div className={styles.gameGrid}>
                {visibleGames.map((g, i) => (
                  <div key={g.id} className={styles.gameCard} style={{ '--idx': i }}>
                    <div className={styles.gameCover}>
                      {g.cover
                        ? <img src={g.cover} alt={g.title} className={styles.gameCoverImg} />
                        : <div className={styles.gamePlaceholder}>{g.emoji}</div>
                      }
                      <div className={styles.gameCoverOverlay} />
                      <div className={styles.gameCoverTags}>
                        {g.tags.map((t) => <span key={t} className={styles.gameTag}>{t}</span>)}
                      </div>
                    </div>
                    <div className={styles.gameBody}>
                      <div className={styles.gameTitle}>{g.title}</div>
                      <div className={styles.gameMeta}>
                        <span className={styles.gameYear}>{g.year}</span>
                        <span className={styles.gameHours}>{g.hours}</span>
                      </div>
                      <p className={styles.gameComment}>"{g.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* /body */}
      </div>
    </div>
  )
}
