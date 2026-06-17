import { useState, useEffect, useRef } from 'react'
import styles from './GameDetail.module.css'
import GridScan from './GridScan'
import BorderGlow from '../BorderGlow/BorderGlow'
import Masonry from './Masonry'
import { asset } from '../../utils/asset'

const CATEGORIES = [
  {
    id: 'gacha', name: '二次元', nameEn: 'Gacha / ACG', icon: '✦',
    color: 'rgba(168,85,247,0.75)',
    glowColor: '280 70 65', colors: ['#a855f7', '#c084fc', '#e879f9'],
    desc: '手游、ACG、米哈游宇宙',
    bg: asset('/ams.jpg'),
  },
  {
    id: 'war', name: '战争', nameEn: 'War / Strategy', icon: '✕',
    color: 'rgba(245,158,11,0.75)',
    glowColor: '38 90 60', colors: ['#f59e0b', '#fbbf24', '#fde68a'],
    desc: '坦克、步兵、真实战场模拟',
    bg: asset('/war3.png'),
  },
  {
    id: 'coop', name: '合作', nameEn: 'Co-op', icon: '◈',
    color: 'rgba(16,185,129,0.75)',
    glowColor: '160 75 50', colors: ['#10b981', '#34d399', '#6ee7b7'],
    desc: '多人协作、欢乐向、好友同乐',
    bg: asset('/21f30ef8d6a2f1b6fef9de0ffcfe9433390888756.png'),
  },
]

const GAMES = [
  // 二次元
  { id:'mingchao',    cat:'gacha', title:'鸣潮',       hours:'',      height:280,
    img: asset('/wuwa.jpg'), url:'' },
  { id:'azurelane',  cat:'gacha', title:'碧蓝航线',   hours:'',      height:260,
    img: asset('/eedc890fcf4e0797e7d8a58e4225978a6b2570cb.png'), url:'' },
  { id:'gfl',        cat:'gacha', title:'少女前线',   hours:'',      height:300,
    img: asset('/1afbe8db9a6650795675297cce30a019.jpg'), url:'' },
  { id:'nte',        cat:'gacha', title:'异环',        hours:'',      height:240,
    img: asset('/1732771405_783639.jpg'), url:'' },

  // 战争
  { id:'hoi4',       cat:'war',   title:'钢铁雄心4',  hours:'300h+', height:260,
    img:'https://cdn.akamai.steamstatic.com/steam/apps/394360/library_600x900.jpg', url:'',
    bgPosition:'center 30%' },
  { id:'wt',         cat:'war',   title:'战争雷霆',   hours:'900h+', height:300,
    img:'https://cdn.akamai.steamstatic.com/steam/apps/236390/library_600x900.jpg', url:'',
    warning:'仇人陷害，不要玩！！！！\n我已经深受其害，脱身不了了。' },
  { id:'stellaris',  cat:'war',   title:'群星',        hours:'150h+', height:280,
    img:'https://cdn.akamai.steamstatic.com/steam/apps/281990/library_600x900.jpg', url:'' },
  { id:'wow',        cat:'war',   title:'战舰世界',   hours:'100h+', height:220,
    img:'https://cdn.akamai.steamstatic.com/steam/apps/552990/library_600x900.jpg', url:'' },
  { id:'ace7',       cat:'war',   title:'皇牌空战7',  hours:'',      height:260,
    img:'https://cdn.akamai.steamstatic.com/steam/apps/502500/library_600x900.jpg', url:'' },

  // 合作
  { id:'peak',       cat:'coop',  title:'PEAK',        hours:'',      height:300,
    img: asset('/OIP-C.webp'), url:'' },
  { id:'lethal',     cat:'coop',  title:'致命公司',   hours:'40h+',  height:260,
    img:'https://cdn.akamai.steamstatic.com/steam/apps/1966720/library_600x900.jpg', url:'' },
  { id:'guiltyasock',cat:'coop',  title:'袜罪并罚',   hours:'',      height:280,
    img:'https://cdn.akamai.steamstatic.com/steam/apps/3400930/library_600x900.jpg', url:'' },
]

const CAT_ORDER = CATEGORIES.map(c => c.id)

// 砖块切换：把屏幕分成 N 列，每列依次 clip-path 滑入
function useBrickTransition(activeCat) {
  const [displayCat, setDisplayCat] = useState(activeCat)
  const [prevCat, setPrevCat]       = useState(null)
  const [direction, setDirection]   = useState(1)   // 1=向右进, -1=向左进
  const [phase, setPhase]           = useState('idle') // 'idle' | 'animating'
  const pendingRef = useRef(null)

  useEffect(() => {
    if (activeCat === displayCat) return
    const fromIdx = CAT_ORDER.indexOf(displayCat)
    const toIdx   = CAT_ORDER.indexOf(activeCat)
    setDirection(toIdx > fromIdx ? 1 : -1)
    setPrevCat(displayCat)
    setDisplayCat(activeCat)
    setPhase('animating')
    pendingRef.current = setTimeout(() => {
      setPrevCat(null)
      setPhase('idle')
    }, 900)
  }, [activeCat])

  useEffect(() => () => clearTimeout(pendingRef.current), [])

  return { displayCat, prevCat, direction, phase }
}

export default function GameDetail({ onClose }) {
  const [closing,    setClosing]    = useState(false)
  const [phase,      setPhase]      = useState('menu')
  const [activeCat,  setActiveCat]  = useState('gacha')
  const [introStage, setIntroStage] = useState('scanning')

  const { displayCat, prevCat, direction, phase: brickPhase } = useBrickTransition(activeCat)

  const handleClose = () => { setClosing(true); setTimeout(onClose, 300) }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setIntroStage('revealing'), 1100)
    const t2 = setTimeout(() => setIntroStage('ready'), 1700)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t1); clearTimeout(t2)
    }
  }, [])

  const handleCatClick = (catId) => { setActiveCat(catId); setPhase('game') }
  const handleTabClick = (catId) => { setActiveCat(catId) }

  const masonryItems = GAMES.filter(g => g.cat === activeCat)
  const isScanning  = introStage === 'scanning'
  const isRevealing = introStage === 'revealing'

  const currentBg = CATEGORIES.find(c => c.id === displayCat)?.bg ?? asset('/war1.webp')
  const prevBg    = prevCat ? CATEGORIES.find(c => c.id === prevCat)?.bg : null

  return (
    <div
      className={`${styles.overlay} ${isScanning ? styles.overlayBlack : ''} ${closing ? styles.overlayClosing : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      {/* 背景图层 */}
      {!isScanning && (
        <div className={styles.bgLayer} aria-hidden>
          {phase === 'menu' ? (
            /* 主菜单：原始壁纸静态显示 */
            <div className={styles.bgStatic} style={{ backgroundImage: `url(${asset('/war1.webp')})` }} />
          ) : (
            /* 游戏列表：砖块切换 */
            <>
              {prevBg && (
                <div className={styles.bgSlidePrev} style={{ backgroundImage: `url(${prevBg})` }} />
              )}
              <div className={styles.brickContainer}>
                {Array.from({ length: 8 }, (_, col) => (
                  <div
                    key={`${displayCat}-${col}`}
                    className={`${styles.brick} ${styles.brickAnimate}`}
                    style={{
                      backgroundImage: `url(${currentBg})`,
                      backgroundPositionX: `${(col / 7) * 100}%`,
                      '--col': col,
                      '--dir': direction,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* GridScan 入场扫描层 */}
      {introStage !== 'ready' && (
        <div className={`${styles.scanIntro} ${isRevealing ? styles.scanIntroHide : ''}`}>
          <GridScan
            sensitivity={0.3} lineThickness={1} linesColor="#1a2a4a"
            gridScale={0.08} scanColor="#4f9eff" scanOpacity={0.65}
            scanDirection="forward" scanDuration={1.0} scanDelay={0}
            scanGlow={0.9} scanSoftness={2.5} enablePost={false} noiseIntensity={0.005}
          />
        </div>
      )}

      {!isScanning && (
        <div className={`${styles.panel} ${isRevealing ? styles.panelReveal : styles.panelReady} ${closing ? styles.panelClosing : ''}`}>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="关闭">✕</button>

          <div className={styles.header}>
            <span className={styles.headerLabel}>02 · GAMES</span>
            <h2 className={styles.headerTitle}>游戏档案</h2>
            <p className={styles.headerSub}>{GAMES.length} 款游戏 · 跨越二次元、战场与星际</p>
          </div>

          <div className={styles.body}>
            {phase === 'menu' && (
              <div className={styles.catMenu}>
                {CATEGORIES.map((cat, i) => (
                  <BorderGlow
                    key={cat.id}
                    backgroundColor="rgba(8,12,26,0.72)"
                    borderRadius={10}
                    glowColor={cat.glowColor}
                    glowRadius={44}
                    glowIntensity={1.3}
                    coneSpread={22}
                    edgeSensitivity={28}
                    colors={cat.colors}
                    fillOpacity={0.22}
                    className={styles.catCardGlow}
                    style={{ '--i': i }}
                  >
                    <button
                      className={styles.catCard}
                      onClick={() => handleCatClick(cat.id)}
                      aria-label={`进入${cat.name}分类`}
                    >
                      <span className={styles.catCardNum}>0{i + 1}</span>
                      <span className={styles.catCardIcon}>{cat.icon}</span>
                      <div className={styles.catCardMain}>
                        <span className={styles.catCardName}>{cat.name}</span>
                        <span className={styles.catCardEn}>{cat.nameEn}</span>
                        <span className={styles.catCardDesc}>{cat.desc}</span>
                      </div>
                      <div className={styles.catCardMeta}>
                        <span className={styles.catCardCount}>{GAMES.filter(g => g.cat === cat.id).length}</span>
                        <span className={styles.catCardCountLabel}>款游戏</span>
                      </div>
                      <span className={styles.catCardArrow}>→</span>
                    </button>
                  </BorderGlow>
                ))}
              </div>
            )}

            <div className={`${styles.gameLayer} ${phase === 'game' ? styles.gameLayerVisible : ''}`}>
              <div className={styles.gameHeader}>
                <button className={styles.backBtn} onClick={() => setPhase('menu')}>← 返回</button>
                <div className={styles.catTabs}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id}
                      className={`${styles.catTab} ${activeCat === cat.id ? styles.catTabActive : ''}`}
                      onClick={() => handleTabClick(cat.id)}>
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.masonryWrap}>
                <Masonry
                  key={activeCat}
                  items={masonryItems}
                  animateFrom="bottom"
                  stagger={0.06}
                  blurToFocus={true}
                  scaleOnHover={true}
                  hoverScale={0.97}
                  colorShiftOnHover={false}
                  columns={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
