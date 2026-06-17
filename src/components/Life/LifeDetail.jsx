import React, { useEffect, useState } from 'react'
import styles from './LifeDetail.module.css'

const WEATHER = { city: '上海', temp: 28, condition: '多云', icon: '⛅', wind: '东南风 3级' }

const PERIOD_SLOTS = [
  { n:1,  t:'08:00-08:45' }, { n:2,  t:'08:55-09:40' },
  { n:3,  t:'10:00-10:45' }, { n:4,  t:'10:55-11:40' },
  { n:5,  t:'12:00-12:45' }, { n:6,  t:'12:55-13:40' },
  { n:7,  t:'14:00-14:45' }, { n:8,  t:'14:55-15:40' },
  { n:9,  t:'16:00-16:45' }, { n:10, t:'16:55-17:40' },
]

const COURSES = [
  { day:1, s:3, e:4, name:'羽毛球',            room:'霍英东体育馆',   teacher:'高渐宽',   color:'#a855f7' },
  { day:1, s:7, e:8, name:'嵌入式系统与接口技术', room:'下院211',       teacher:'罗林根',   color:'#f87171' },
  { day:2, s:1, e:2, name:'信号与系统(B类)',     room:'下院113',       teacher:'韩韬',     color:'#fb7185' },
  { day:2, s:7, e:8, name:'人工智能算法实践',    room:'不排教室',       teacher:'王德泉',   color:'#60a5fa' },
  { day:3, s:1, e:2, name:'人工智能理论与应用',  room:'东中院1-108',   teacher:'杨学',     color:'#60a5fa' },
  { day:3, s:9, e:9, name:'嵌入式系统与接口技术', room:'下院211',       teacher:'罗林根',   color:'#f87171' },
  { day:4, s:1, e:2, name:'工程实践与科技创新II', room:'上院207',       teacher:'王俊璞',   color:'#34d399' },
  { day:4, s:6, e:7, name:'马克思主义基本原理',  room:'上院115',       teacher:'贾微晓',   color:'#fbbf24' },
  { day:4, s:9, e:9, name:'嵌入式系统与接口技术', room:'下院211',       teacher:'罗林根',   color:'#f87171' },
  { day:5, s:9, e:10,name:'大学物理(A类)',       room:'上院515',       teacher:'纳瑞囝',   color:'#f87171' },
]

const DAYS  = ['一','二','三','四','五']
const WEEK  = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
const MONTHS= ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const NOTES = [
  { id:1, isTitle:true, mood:'😭😤', content:'嵌入式你为什么这么坏' },
  { id:2, date:'06.17', mood:'⚽', content:'夕有向前的赵考试周看英格兰踢克罗地亚欧洲杯，成为一代经典，今有我顶着早八四点起床看英格兰踢克罗地亚世界杯' },
  { id:3, date:'06.17', mood:'⚽', content:'早上梅西帽子戏法不赖' },
  { id:4, date:'06.16', mood:'🤬', content:'卧槽DDL赶不完了！！！！' },
  { id:5, date:'06.15', mood:'😤', content:'战争雷霆害人不浅' },
]

const SONGS = [
  { rank:1,  title:'敢归云间宿',     artist:'三无Marblue' },
  { rank:2,  title:'山河令',         artist:'三无Marblue, 茶理理理子' },
  { rank:3,  title:'红尘寄雪',       artist:'被遗忘者的哀伤, 鬼面P' },
  { rank:4,  title:'两相知',         artist:'三无Marblue, 祖妮纳惜' },
  { rank:5,  title:'春庭雪',         artist:'邓寓君(等什么君)' },
  { rank:6,  title:'大哉乾元',       artist:'洛天依' },
  { rank:7,  title:'사랑해',         artist:'라나에로스포' },
  { rank:8,  title:'鹊引桥',         artist:'hanser' },
  { rank:9,  title:'烟花消逝的瞬间', artist:'思敏哥哥' },
  { rank:10, title:'青云羡',         artist:'泽典' },
]

const TILES = [
  { id:'schedule', icon:'🗓', label:'SCHEDULE', title:'当前课表', desc:'第16周 · 10门次' },
  { id:'notes',    icon:'✍️',  label:'LIFE · NOTES', title:'生活吐槽', desc:'碎碎念 · 随手记' },
  { id:'playlist', icon:'🎵', label:'MUSIC',    title:'我的歌单', desc:'年度 TOP 10' },
]

export default function LifeDetail({ onClose }) {
  const [closing,    setClosing]    = useState(false)
  const [now,        setNow]        = useState(new Date())
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (activeCard) setActiveCard(null)
        else handleClose()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [activeCard])

  const handleClose = () => { setClosing(true); setTimeout(onClose, 300) }

  const todayDow  = now.getDay()
  const todaySlot = todayDow >= 1 && todayDow <= 5 ? todayDow : null
  const h24  = now.getHours()
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12  = String(h24 % 12 || 12).padStart(2, '0')
  const min  = String(now.getMinutes()).padStart(2, '0')
  const sec  = String(now.getSeconds()).padStart(2, '0')
  const dateStr = `${WEEK[now.getDay()]} / ${MONTHS[now.getMonth()]} / ${String(now.getDate()).padStart(2,'0')} / ${now.getFullYear()}`

  return (
    <div className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
         onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}>
      <div className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}>

        <div className={styles.bg} />
        <div className={styles.bgTint} />

        <button className={styles.closeBtn} onClick={handleClose}>✕</button>

        {/* 天气 左上 */}
        <div className={styles.weather}>
          <span className={styles.weatherIcon}>{WEATHER.icon}</span>
          <div className={styles.weatherMain}>
            <span className={styles.weatherTemp}>{WEATHER.temp}°</span>
            <span className={styles.weatherCond}>{WEATHER.condition}</span>
          </div>
          <div className={styles.weatherSub}>{WEATHER.city} · {WEATHER.wind}</div>
        </div>

        {/* 三个折叠卡片 */}
        <div className={styles.showcase}>
          {TILES.map((tile, i) => (
            <button key={tile.id} className={styles.tile} style={{ '--ti': i }}
                    onClick={() => setActiveCard(tile.id)}>
              <div className={styles.tileGlow} />
              <span className={styles.tileNum}>0{i + 1}</span>
              <span className={styles.tileIcon}>{tile.icon}</span>
              <div className={styles.tileMain}>
                <span className={styles.tileTitle}>{tile.title}</span>
                <span className={styles.tileEn}>{tile.label}</span>
                <span className={styles.tileDesc}>{tile.desc}</span>
              </div>
              <span className={styles.tileArrow}>→</span>
            </button>
          ))}
        </div>

        {/* 展开层 */}
        {activeCard && (
          <div className={styles.expanded} key={activeCard}>
            <button className={styles.backBtn} onClick={() => setActiveCard(null)}>← 返回</button>

            {activeCard === 'schedule' && (
              <div className={styles.expInner}>
                <div className={styles.expHeader}>
                  <span className={styles.expLabel}>SCHEDULE</span>
                  <h3 className={styles.expTitle}>当前课表</h3>
                </div>
                <div className={styles.schWrap}>
                  <div className={styles.schGrid}>
                    {/* 空角 */}
                    <div className={styles.schCorner}>第16周</div>
                    {DAYS.map((d, i) => (
                      <div key={d} className={`${styles.schDayHd} ${todaySlot === i+1 ? styles.schToday : ''}`}>
                        周{d}
                      </div>
                    ))}
                    {PERIOD_SLOTS.map((p) => (
                      <React.Fragment key={p.n}>
                        <div className={styles.schTime}>
                          <span className={styles.schPeriodNum}>{p.n}</span>
                          <span className={styles.schPeriodTime}>{p.t}</span>
                        </div>
                        {DAYS.map((_, di) => (
                          <div key={di} className={`${styles.schCell} ${todaySlot === di+1 ? styles.schCellToday : ''}`} />
                        ))}
                      </React.Fragment>
                    ))}
                    {/* 课程块 */}
                    {COURSES.map((c, ci) => (
                      <div key={ci} className={styles.schCourse}
                        style={{
                          gridColumn: c.day + 1,
                          gridRow: `${c.s + 1} / ${c.e + 2}`,
                          '--cc': c.color,
                        }}>
                        <span className={styles.schCourseName}>{c.name}</span>
                        <span className={styles.schCourseRoom}>@{c.room}</span>
                        <span className={styles.schCourseTeacher}>{c.teacher}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCard === 'notes' && (
              <div className={styles.expInner}>
                <div className={styles.expHeader}>
                  <span className={styles.expLabel}>LIFE · NOTES</span>
                  <h3 className={styles.expTitle}>生活吐槽</h3>
                </div>
                <div className={styles.noteList}>
                  {NOTES.map((n, idx) => (
                    <div key={n.id} className={`${styles.noteItem} ${n.isTitle ? styles.noteItemTitle : ''}`}
                         style={{ '--ni': idx }}>
                      <div className={styles.noteMeta}>
                        <span className={styles.noteMood}>{n.mood}</span>
                        {n.date && <span className={styles.noteDate}>{n.date}</span>}
                      </div>
                      <p className={`${styles.noteText} ${n.isTitle ? styles.noteTextBig : ''}`}>
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeCard === 'playlist' && (
              <div className={styles.expInner}>
                <div className={styles.expHeader}>
                  <span className={styles.expLabel}>2025 MUSIC REPORT</span>
                  <h3 className={styles.expTitle}>我的歌单</h3>
                </div>
                <div className={styles.songTop}>
                  <div className={styles.songTopRank}>01</div>
                  <div>
                    <div className={styles.songTopTitle}>《{SONGS[0].title}》</div>
                    <div className={styles.songTopArtist}>{SONGS[0].artist}</div>
                  </div>
                </div>
                <div className={styles.songList}>
                  {SONGS.slice(1).map((s) => (
                    <div key={s.rank} className={styles.songRow}>
                      <span className={styles.songRank}>{String(s.rank).padStart(2,'0')}</span>
                      <span className={styles.songTitle}>《{s.title}》</span>
                      <span className={styles.songArtist}>{s.artist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 时钟 右下 */}
        <div className={styles.clock}>
          <div className={styles.clockTime}>{h12}:{min}<span className={styles.clockAmpm}>{ampm}</span></div>
          <div className={styles.clockSec}>{sec}</div>
          <div className={styles.clockDate}>{dateStr}</div>
        </div>

      </div>
    </div>
  )
}
