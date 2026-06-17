import { useEffect, useState } from 'react'
import styles from './SJMAModal.module.css'
import { asset } from '../../utils/asset'

const BANNER = asset('/微信图片_20260617221758_318_115.jpg')
const EMBEDDED = asset('/屏幕截图 2026-06-17 221927.png')
const STAMP = asset('/微信图片_20260617222347_319_115.jpg')

export default function SJMAModal({ screen, onNext, onClose }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 280)
  }

  return (
    <div className={`${styles.overlay} ${closing ? styles.overlayOut : ''}`}>
      <div className={`${styles.modal} ${closing ? styles.modalOut : ''}`}>

        <button className={styles.closeBtn} onClick={handleClose} aria-label="关闭">✕</button>

        {/* 顶部横幅 */}
        <div className={styles.banner}>
          <img src={BANNER} alt="上海交通大学国防军事协会" className={styles.bannerImg} />
        </div>

        {screen === 'pitch' && (
          <div className={styles.body}>
            {/* 左侧：嵌入式截图 */}
            <div className={styles.sideImg}>
              <img src={EMBEDDED} alt="嵌入式系统与接口技术 1.4分" className={styles.sideImgEl} />
            </div>

            {/* 右侧：招募文字 */}
            <div className={styles.content}>
              <p className={styles.pitchText}>
                超级交大，我们的家园。<br />
                饮水思源，爱国荣校，我们的生存正道。<br /><br />
                但，金课也有其代价。<br />
                <span className={styles.cry}>不...我的嵌入式！不！</span><br /><br />
                觉得眼熟吗？<br />
                这样的场景，正在交大各处上演！<br />
                下一个就可能是你！<br /><br />
                现在，轮到你做出这个生命中最重要的决定，向所有人证明，你拥有追求自由的勇气和力量！<br /><br />
                <span className={styles.cta}>加入交大军协 SJMA!</span>
              </p>
              <button className={styles.interestBtn} onClick={onNext}>
                我感兴趣 →
              </button>
            </div>
          </div>
        )}

        {screen === 'intro' && (
          <div className={styles.body}>
            {/* 左侧：印章 */}
            <div className={styles.sideImg}>
              <img src={STAMP} alt="交大军协印章" className={styles.sideImgEl} />
            </div>

            {/* 右侧：协会介绍 */}
            <div className={styles.content}>
              <h3 className={styles.introTitle}>关于 SJMA</h3>
              <p className={styles.introText}>
                上海交通大学国防军事协会（SJTU Military Association）成立于 2023 年，由本校军事爱好者组建成立，挂靠上海交通大学人民武装部。
              </p>
              <p className={styles.introText}>
                协会日常在校内开展真人 CS、兵棋推演、体能或 CQB 训练等活动，不定期与校内各院系合作开展主题活动，如"火箭筒发射体验"、"国家安全日"、"特色团日活动"等，节假日期间组织赴外交流学习 or 军推 Milsim。
              </p>
              <p className={styles.introText}>
                社团目前具有完善的组织体系，下设四个部门：军研部、活动部、影像部、运营部。社团骨干还有机会参与每年的新生军训工作，负责部分项目的策划组织开展。
              </p>
              <button className={styles.interestBtn} onClick={handleClose}>
                知道了，我会考虑的
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
