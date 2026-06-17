import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup,
} from 'react-simple-maps'
import styles from './TravelDetail.module.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const ZOOM = 6.0
/* marker SVG 尺寸 = 目标屏幕尺寸 / ZOOM，使视觉大小与缩放无关 */
const MR_BUBBLE    = +(14 / ZOOM).toFixed(3)   /* 目标屏幕半径 14px */
const MR_PULSE     = +(18 / ZOOM).toFixed(3)   /* 18px */
const MR_DRILLRING = +(23 / ZOOM).toFixed(3)   /* 23px */
const FLAG_W       = +(21 / ZOOM).toFixed(3)   /* 旗帜宽 21px */
const FLAG_H       = +(14 / ZOOM).toFixed(3)   /* 旗帜高 14px */
const FLAG_X       = +(-10.5 / ZOOM).toFixed(3)
const FLAG_Y       = +(-7    / ZOOM).toFixed(3)
const LABEL_Y      = +(23    / ZOOM).toFixed(3) /* 标签距中心 23px */

const REGIONS = [
  {
    id: 'asia', label: '亚洲', labelEn: 'Asia', center: [108, 28],
    icon: (
      <svg viewBox="0 0 48 32" fill="none" strokeWidth="1.2">
        <path d="M8 16 Q14 8 22 10 Q30 6 36 12 Q42 10 44 16 Q40 22 34 20 Q28 26 20 22 Q12 24 8 16Z" stroke="currentColor" fill="none"/>
        <path d="M22 10 Q24 14 26 10" stroke="currentColor" fill="none"/>
        <path d="M34 20 Q36 24 38 22" stroke="currentColor" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'europe', label: '欧洲', labelEn: 'Europe', center: [10, 51],
    icon: (
      <svg viewBox="0 0 48 32" fill="none" strokeWidth="1.2">
        <path d="M10 20 Q14 10 22 8 Q30 6 36 14 Q38 20 32 22 Q26 26 18 24 Q12 24 10 20Z" stroke="currentColor" fill="none"/>
        <path d="M22 8 L20 14" stroke="currentColor" fill="none"/>
        <path d="M30 10 L28 16" stroke="currentColor" fill="none"/>
        <path d="M14 18 Q18 16 22 18" stroke="currentColor" fill="none"/>
      </svg>
    ),
  },
]

const DRILLDOWN_CFG = {
  cn: {
    center: [104, 35], zoom: 8, rotate: [-104, -35, 0], isoNum: '156',
    cities: [
      { name: '北京',  coordinates: [116.4,  39.9],  brief: '千年帝都，故宫、长城、颐和园，历史的厚重在每一块砖石间流淌。' },
      { name: '上海',  coordinates: [121.5,  31.2],  brief: '家乡所在，外滩的霓虹与黄浦江的涛声见证着这座城市的百年蜕变。' },
      { name: '成都',  coordinates: [104.1,  30.6],  brief: '天府之国，熊猫故乡，一碗热腾腾的火锅包含了这座城市所有的闲适与热情。' },
      { name: '西安',  coordinates: [108.9,  34.3],  brief: '丝绸之路的起点，秦俑的家园，十三朝古都的风华依稀可见。' },
      { name: '张家界', coordinates: [110.48, 29.12], brief: '悬浮于云海之上的石柱群是大自然最奇幻的雕塑，《阿凡达》潘多拉星球的灵感原型。' },
      { name: '抚仙湖', coordinates: [102.88, 24.52], brief: '云南高原上的深水明珠，湖水清澈见底，日落时金光洒满湖面，宁静而壮美。' },
      { name: '九寨沟', coordinates: [103.92, 33.26], brief: '五彩池、珍珠滩、诺日朗瀑布……每一处都是不可思议的调色盘，童话里才有的颜色。' },
      { name: '福州',  coordinates: [119.3,  26.08], brief: '三坊七巷的青石板路、烟台山的老洋楼，闽都古韵与海滨风情在这里悠然共存。' },
    ],
  },
  de: {
    center: [10, 51], zoom: 18, rotate: [-10, -51, 0], isoNum: '276',
    cities: [
      { name: '柏林',    coordinates: [13.4,  52.52], brief: '统一的首都，东西德的历史在这里交汇，勃兰登堡门见证了无数历史瞬间。' },
      { name: '慕尼黑',  coordinates: [11.58, 48.14], brief: '啤酒节的故乡，巴伐利亚文化的精粹，新天鹅堡就藏在这里的山间。' },
      { name: '科隆',    coordinates: [6.96,  50.94], brief: '科隆大教堂双塔直刺苍穹，历时六百年建成，莱茵河畔的千年信仰。' },
      { name: '法兰克福', coordinates: [8.68,  50.11], brief: '德国金融中心，歌德的故乡，现代高楼与古典建筑在这里并肩而立。' },
      { name: '汉堡',    coordinates: [10.00, 53.55], brief: '德国最大的港口城市，仓库城的砖红色建筑倒映在运河之中，气势磅礴。' },
      { name: '蒙斯特',  coordinates: [7.63,  51.96], brief: '德国坦克博物馆所在地——可惜去的时机不对，闭馆了，很是遗憾。' },
      { name: '科布伦茨', coordinates: [7.59,  50.36], brief: '在这里弥补了蒙斯特的遗憾，军事博物馆藏品极其丰富，令人大开眼界。' },
      { name: '波恩',    coordinates: [7.10,  50.73], brief: '贝多芬的出生地，前联邦德国首都，莱茵河畔静谧而充满文化气息的古城。' },
      { name: '新天鹅堡', coordinates: [10.75, 47.56], brief: '巴伐利亚阿尔卑斯山中最浪漫的童话城堡，迪士尼城堡的灵感原型。' },
      { name: '德累斯顿', coordinates: [13.74, 51.05], brief: '欧洲最美城市，从大轰炸的废墟下重生，茨温格宫与圣母教堂见证涅槃。' },
    ],
  },
}

const VISITED = [
  {
    id: 'cn', name: '中国', flagCode: 'cn',
    coordinates: [104, 35], year: '长居', drilldown: true,
    brief: '家乡。从江南水乡到西北戈壁，从东北雪原到南海碧波，960 万平方公里的土地上藏着无数风景。',
    highlights: ['上海', '北京', '成都', '西安'],
  },
  {
    id: 'jp', name: '日本', flagCode: 'jp',
    coordinates: [138, 36], year: '2024',
    brief: '动漫圣地朝圣之旅。秋叶原的手办、京都的红叶、大阪的章鱼烧，每一处都是活生生的二次元。',
    highlights: ['东京', '大阪', '京都', '奈良'],
  },
  {
    id: 'th', name: '泰国', flagCode: 'th',
    coordinates: [100.9, 15.9], year: '2023',
    brief: '曼谷的夜市、清迈的古城、普吉岛的碧海银沙，热带风情与历史文化交织的东南亚画卷。',
    highlights: ['曼谷', '清迈', '普吉'],
  },
  {
    id: 'my', name: '马来西亚', flagCode: 'my',
    coordinates: [109.7, 4.2], year: '2023',
    brief: '双峰塔下的现代都市与热带雨林交融，多元文化的马来西亚用美食和风景征服每一位旅者。',
    highlights: ['吉隆坡', '槟城', '沙巴'],
  },
  {
    id: 'sg', name: '新加坡', flagCode: 'sg',
    coordinates: [103.8, 1.35], year: '2023',
    brief: '花园城市的整洁与高效，滨海湾花园的奇幻夜景，展示了现代城市规划的极致样本。',
    highlights: ['滨海湾', '乌节路', '圣淘沙'],
  },
  {
    id: 'ph', name: '菲律宾', flagCode: 'ph',
    coordinates: [122, 12.9], year: '2024',
    brief: '长滩岛的白沙海滩绵延数公里，碧蓝的海水与细腻沙滩构成东南亚最纯粹的海岛体验。',
    highlights: ['长滩岛', '马尼拉', '宿务'],
  },
  {
    id: 'lk', name: '斯里兰卡', flagCode: 'lk',
    coordinates: [80.7, 7.8], year: '2022',
    brief: '印度洋上的泪珠，僧伽罗古都的遗迹与高地茶园共同构成了这座岛国如诗如画的面貌。',
    highlights: ['科伦坡', '康提', '努沃勒埃利耶'],
  },
  {
    id: 'de', name: '德国', flagCode: 'de',
    coordinates: [10.4, 51.2], year: '2023', drilldown: true,
    brief: '慕尼黑的啤酒节、柏林的历史印记、科隆大教堂的哥特式穹顶。严谨的工业大国藏着浓厚的人文底蕴。',
    highlights: ['柏林', '慕尼黑', '科隆', '法兰克福', '汉堡', '德累斯顿'],
  },
  {
    id: 'cz', name: '捷克', flagCode: 'cz',
    coordinates: [15.5, 49.8], year: '2023',
    brief: '布拉格古城是欧洲保存最完好的中世纪城市之一，查理大桥与布拉格城堡在金色的夕阳下熠熠生辉。',
    highlights: ['布拉格', '布尔诺', '卡罗维发利'],
  },
]

/* 203 = 捷克 */
const VISITED_ISO_NUMS = new Set(['156','392','276','764','458','702','608','144','203'])

function detectRegion(rotation) {
  const lon = -rotation[0], lat = -rotation[1]
  let best = REGIONS[0], bestDist = Infinity
  for (const r of REGIONS) {
    const d = (lon - r.center[0]) ** 2 + (lat - r.center[1]) ** 2
    if (d < bestDist) { bestDist = d; best = r }
  }
  return best.id
}

function lerpAngle(a, b, t) {
  const d = ((b - a) % 360 + 540) % 360 - 180
  return a + d * t
}

/* ── 国家弹窗 ── */
function PopupCard({ place, anchor, mapW, mapH, onClose }) {
  const W = 296, H = 180
  let left = anchor.x + 28
  if (left + W > mapW - 12) left = anchor.x - W - 28
  let top = Math.max(10, Math.min(mapH - H - 10, anchor.y - H / 2))
  return (
    <div className={styles.popup} style={{ left, top }}>
      <div className={styles.popupHeader}>
        <img src={`https://flagcdn.com/w40/${place.flagCode}.png`} alt={place.name} className={styles.popupFlagImg} />
        <div className={styles.popupMeta}>
          <h3 className={styles.popupName}>{place.name}</h3>
          <span className={styles.popupYear}>{place.year}</span>
        </div>
        <button className={styles.popupClose} onClick={onClose}>✕</button>
      </div>
      <p className={styles.popupBrief}>{place.brief}</p>
      <div className={styles.popupTags}>
        {place.highlights.map(h => <span key={h} className={styles.popupTag}>{h}</span>)}
      </div>
    </div>
  )
}

/* ── 城市弹窗 ── */
function CityPopupCard({ city, anchor, areaW, areaH, onClose }) {
  const W = 260, H = 110
  let left = anchor.x + 20
  if (left + W > areaW - 10) left = anchor.x - W - 20
  let top = Math.max(10, Math.min(areaH - H - 10, anchor.y - H / 2))
  return (
    <div className={styles.cityPopup} style={{ left, top }}>
      <div className={styles.cityPopupHeader}>
        <span className={styles.cityPopupName}>{city.name}</span>
        <button className={styles.popupClose} onClick={onClose}>✕</button>
      </div>
      <p className={styles.cityPopupBrief}>{city.brief}</p>
    </div>
  )
}

/* ── Drill-down 放大地图（含城市点击居中） ── */
function DrilldownView({ countryId, place, onBack }) {
  const cfg = DRILLDOWN_CFG[countryId]

  const [drillCenter,  setDrillCenter]  = useState(cfg.center)
  const [selectedCity, setSelectedCity] = useState(null)
  const [cityAnchor,   setCityAnchor]   = useState(null)
  const centerRef  = useRef(cfg.center)
  const drillAnimRef = useRef(null)
  const mapAreaRef = useRef(null)

  /* 气泡尺寸补偿 zoom */
  const s   = 1 / cfg.zoom
  const pR  = +(2.5 * s).toFixed(4)
  const dR  = +(1.0 * s).toFixed(4)
  const fSz = +(8   * s).toFixed(4)
  const yOff= +(-4  * s).toFixed(4)

  const animateToCityCoords = useCallback((city) => {
    const start  = [...centerRef.current]
    const target = [...city.coordinates]
    const t0 = performance.now(), dur = 500
    if (drillAnimRef.current) cancelAnimationFrame(drillAnimRef.current)
    const tick = (now) => {
      const prog = Math.min(1, (now - t0) / dur)
      const ease = 1 - (1 - prog) ** 3
      const c = [
        start[0] + (target[0] - start[0]) * ease,
        start[1] + (target[1] - start[1]) * ease,
      ]
      setDrillCenter(c)
      centerRef.current = c
      if (prog < 1) drillAnimRef.current = requestAnimationFrame(tick)
      else {
        setSelectedCity(city)
        if (mapAreaRef.current) {
          setCityAnchor({
            x: mapAreaRef.current.offsetWidth  / 2,
            y: mapAreaRef.current.offsetHeight / 2,
          })
        }
      }
    }
    drillAnimRef.current = requestAnimationFrame(tick)
  }, [])

  const handleCityClick = (city) => {
    setSelectedCity(null); setCityAnchor(null)
    animateToCityCoords(city)
  }

  return (
    <div className={styles.drilldownWrap}>
      <div className={styles.drillMapArea} ref={mapAreaRef}>
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ rotate: cfg.rotate, scale: 200 }}
          className={styles.map}
        >
          <ZoomableGroup zoom={cfg.zoom} center={drillCenter} disablePanning>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className={String(geo.id) === cfg.isoNum ? styles.geoDrillTarget : styles.geoDrillOther}
                  />
                ))
              }
            </Geographies>
            {cfg.cities.map(city => (
              <Marker
                key={city.name}
                coordinates={city.coordinates}
                onClick={() => handleCityClick(city)}
              >
                <g style={{ cursor: 'pointer' }}>
                  <circle r={pR} className={`${styles.cityPulse} ${selectedCity?.name === city.name ? styles.cityPulseActive : ''}`} />
                  <circle r={dR} className={`${styles.cityDot}   ${selectedCity?.name === city.name ? styles.cityDotActive   : ''}`} />
                  <text y={yOff} textAnchor="middle" className={styles.cityLabel} style={{ fontSize: `${fSz}px` }}>{city.name}</text>
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {selectedCity && cityAnchor && mapAreaRef.current && (
          <CityPopupCard
            city={selectedCity}
            anchor={cityAnchor}
            areaW={mapAreaRef.current.offsetWidth}
            areaH={mapAreaRef.current.offsetHeight}
            onClose={() => { setSelectedCity(null); setCityAnchor(null) }}
          />
        )}
      </div>

      <div className={styles.drillInfoPanel}>
        <button className={styles.drillbackBtn} onClick={onBack}>← 返回</button>
        <img src={`https://flagcdn.com/w80/${place.flagCode}.png`} alt={place.name} className={styles.drillFlagImg} />
        <div>
          <h3 className={styles.drillName}>{place.name}</h3>
          <span className={styles.drillYear}>{place.year}</span>
        </div>
        <p className={styles.drillBrief}>{place.brief}</p>
        <div>
          <p className={styles.drillCitiesLabel}>已访问城市 · 点击定位</p>
          <div className={styles.drillTags}>
            {cfg.cities.map(c => (
              <span
                key={c.name}
                className={`${styles.drillTag} ${selectedCity?.name === c.name ? styles.drillTagActive : ''}`}
                onClick={() => handleCityClick(c)}
                style={{ cursor: 'pointer' }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 主组件 ── */
export default function TravelDetail({ onClose }) {
  const [closing,      setClosing]      = useState(false)
  const [activeRegion, setActiveRegion] = useState('asia')
  const [selected,     setSelected]     = useState(null)
  const [drilldown,    setDrilldown]    = useState(null)
  const [popupAnchor,  setPopupAnchor]  = useState(null)
  const [rotation,     setRotation]     = useState([0, 0, 0])
  const [zoom,         setZoom]         = useState(1)

  /* intro: 'spin' → 'zoomin' → 'done' */
  const [introPhase, setIntroPhase] = useState('spin')

  const rotRef     = useRef([0, 0, 0])
  const animRef    = useRef(null)
  const dragging   = useRef(false)
  const lastPos    = useRef([0, 0])
  const mapWrapRef = useRef(null)

  /* ── 开场动画 ── */
  useEffect(() => {
    const SPIN_DUR    = 2400   /* 自转时长 ms（慢一圈） */
    const ZOOM_DUR    = 800    /* 最终快速拉近时长 ms */
    const ZOOM_START  = 0.45   /* 自转起始远景 zoom */
    const ZOOM_MID    = 1.1    /* 自转结束时 zoom（缓慢拉近到此） */
    const TARGET_ZOOM = ZOOM * 0.72  /* 最终 zoom（原值偏大，缩小） */
    const TARGET_ROT  = [-108, -28, 0]

    let t0 = performance.now()
    let phase = 'spin'
    let spinStartRot = [0, 0, 0]

    const tick = (now) => {
      const elapsed = now - t0

      if (phase === 'spin') {
        const prog = Math.min(1, elapsed / SPIN_DUR)
        /* 匀速自转一圈 */
        const deg = prog * 360
        const r = [-(deg % 360), -10, 0]
        setRotation(r)
        rotRef.current = r

        /* 自转期间缓慢线性拉近：ZOOM_START → ZOOM_MID */
        setZoom(ZOOM_START + (ZOOM_MID - ZOOM_START) * prog)

        if (elapsed >= SPIN_DUR) {
          spinStartRot = [...r]
          phase = 'zoomin'
          t0 = now
          setIntroPhase('zoomin')
        }
      } else if (phase === 'zoomin') {
        const prog = Math.min(1, elapsed / ZOOM_DUR)
        const ease = 1 - (1 - prog) ** 3

        /* 快速旋转到亚洲中心 */
        const r = [
          lerpAngle(spinStartRot[0], TARGET_ROT[0], ease),
          lerpAngle(spinStartRot[1], TARGET_ROT[1], ease),
          0,
        ]
        setRotation(r)
        rotRef.current = r

        /* 快速拉近到最终 zoom */
        setZoom(ZOOM_MID + (TARGET_ZOOM - ZOOM_MID) * ease)

        if (prog >= 1) {
          setZoom(TARGET_ZOOM)
          setIntroPhase('done')
          setActiveRegion('asia')
          return
        }
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])   /* 仅挂载时运行一次 */

  const animateTo = useCallback((coords, onDone) => {
    /* 如果 intro 还在跑，直接结束它 */
    if (introPhase !== 'done') setIntroPhase('done')
    const target = [-coords[0], -coords[1], 0]
    const start  = [...rotRef.current]
    const t0 = performance.now(), dur = 700
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const tick = (now) => {
      const prog = Math.min(1, (now - t0) / dur)
      const ease = 1 - (1 - prog) ** 3
      const r = [lerpAngle(start[0], target[0], ease), lerpAngle(start[1], target[1], ease), 0]
      setRotation(r); rotRef.current = r
      setActiveRegion(detectRegion(r))
      if (prog < 1) animRef.current = requestAnimationFrame(tick)
      else onDone?.()
    }
    animRef.current = requestAnimationFrame(tick)
  }, [introPhase])

  const jumpToRegion = (r) => {
    setSelected(null); setDrilldown(null); setPopupAnchor(null)
    animateTo(r.center)
  }

  const onPointerDown = (e) => {
    if (introPhase !== 'done') return   /* intro 期间禁用拖拽 */
    if (e.button !== 2) return
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null }
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
    lastPos.current = [e.clientX, e.clientY]
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current[0]
    const dy = e.clientY - lastPos.current[1]
    lastPos.current = [e.clientX, e.clientY]
    const s = 0.3 / ZOOM
    const r = [rotRef.current[0] + dx * s, Math.max(-80, Math.min(80, rotRef.current[1] - dy * s)), 0]
    setRotation(r); rotRef.current = r
    setActiveRegion(detectRegion(r))
  }
  const onPointerUp = () => { dragging.current = false }

  const handleMarkerClick = (place) => {
    setSelected(null); setDrilldown(null); setPopupAnchor(null)
    animateTo(place.coordinates, () => {
      if (mapWrapRef.current) {
        setCityAnchorHelper(mapWrapRef.current)
      }
      if (place.drilldown) setDrilldown(place.id)
      else setSelected(place)
    })
  }
  const setCityAnchorHelper = (el) => {
    setPopupAnchor({ x: el.offsetWidth / 2, y: el.offsetHeight / 2 })
  }

  const handleClose = () => { setClosing(true); setTimeout(onClose, 300) }
  const drillPlace = drilldown ? VISITED.find(v => v.id === drilldown) : null

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      onClick={(e) => { if (e.target.classList.contains(styles.overlay)) handleClose() }}
    >
      <div className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="关闭">✕</button>

        <div className={styles.header}>
          <div>
            <span className={styles.headerLabel}>03 · TRAVEL</span>
            <h2 className={styles.headerTitle}>足迹地图</h2>
            <p className={styles.headerSub}>{VISITED.length} 个国家 · 右键拖拽旋转 · 点击旗帜查看详情</p>
          </div>
          <div className={styles.tabs}>
            {REGIONS.map(r => (
              <button
                key={r.id}
                className={`${styles.tab} ${activeRegion === r.id ? styles.tabActive : ''}`}
                onClick={() => jumpToRegion(r)}
              >
                <span className={styles.tabIcon}>{r.icon}</span>
                <span className={styles.tabLabel}>{r.label}</span>
                <span className={styles.tabLabelEn}>{r.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.mapWrap}
          ref={mapWrapRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onContextMenu={(e) => e.preventDefault()}
          style={{ cursor: dragging.current ? 'grabbing' : 'default' }}
        >
          <div className={styles.globeRing} />

          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{ rotate: rotation, scale: 200 }}
            className={styles.map}
          >
            <defs>
              <clipPath id="travelFlagClip">
                <rect x={FLAG_X} y={FLAG_Y} width={FLAG_W} height={FLAG_H} rx={(1.5/ZOOM).toFixed(3)} />
              </clipPath>
            </defs>
            <ZoomableGroup zoom={zoom} center={[-rotation[0], -rotation[1]]} disablePanning>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      className={VISITED_ISO_NUMS.has(String(geo.id)) ? styles.geoVisited : styles.geo}
                    />
                  ))
                }
              </Geographies>

              {/* intro 完成后才显示 marker */}
              {introPhase === 'done' && VISITED.map(place => (
                <Marker key={place.id} coordinates={place.coordinates} onClick={() => handleMarkerClick(place)}>
                  <g className={styles.markerGroup}>
                    {place.drilldown && <circle r={MR_DRILLRING} className={styles.markerDrillRing} />}
                    <circle r={MR_PULSE}  className={styles.markerPulse} />
                    <circle r={MR_BUBBLE} className={`${styles.markerBubble} ${selected?.id === place.id || drilldown === place.id ? styles.markerActive : ''}`} />
                    <image
                      href={`https://flagcdn.com/w40/${place.flagCode}.png`}
                      x={FLAG_X} y={FLAG_Y} width={FLAG_W} height={FLAG_H}
                      clipPath="url(#travelFlagClip)"
                      style={{ pointerEvents: 'none' }}
                    />
                    <text y={LABEL_Y} textAnchor="middle" className={styles.markerLabel} style={{ fontSize: `${(7/ZOOM).toFixed(3)}px` }}>{place.name}</text>
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {selected && popupAnchor && mapWrapRef.current && (
            <PopupCard
              place={selected}
              anchor={popupAnchor}
              mapW={mapWrapRef.current.offsetWidth}
              mapH={mapWrapRef.current.offsetHeight}
              onClose={() => { setSelected(null); setPopupAnchor(null) }}
            />
          )}

          {drilldown && drillPlace && (
            <DrilldownView
              countryId={drilldown}
              place={drillPlace}
              onBack={() => { setDrilldown(null); setPopupAnchor(null) }}
            />
          )}

          <div className={styles.legend}>
            <div className={styles.legendItem}><span className={styles.legendDotVisited} />已到访</div>
            <div className={styles.legendItem}><span className={styles.legendDot} />其他国家</div>
          </div>
        </div>
      </div>
    </div>
  )
}
