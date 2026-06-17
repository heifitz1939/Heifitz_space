import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState(get);
  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);
  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
};

const preloadImages = async urls => {
  await Promise.all(
    urls.map(src => new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => resolve();
    }))
  );
};

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  colorShiftOnHover = false,
  columns: columnsProp,
}) => {
  const mediaColumns = useMedia(
    ['(min-width:1400px)', '(min-width:1000px)', '(min-width:600px)'],
    [4, 3, 2],
    2
  );
  const columns = columnsProp ?? mediaColumns;

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [warningActive, setWarningActive] = useState(null);
  const [warningStage,  setWarningStage]  = useState(0);
  const warningTimerRef  = useRef(null);
  const stageTimersRef   = useRef([]);

  const getInitialPosition = (item) => {
    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)];
    }
    switch (direction) {
      case 'top':    return { x: item.x, y: -200 };
      case 'bottom': return { x: item.x, y: window.innerHeight + 200 };
      case 'left':   return { x: -200, y: item.y };
      case 'right':  return { x: window.innerWidth + 200, y: item.y };
      default:       return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, totalHeight } = useMemo(() => {
    if (!width) return { grid: [], totalHeight: 0 };
    const colHeights = new Array(columns).fill(0);
    const colW = width / columns;
    const g = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = colW * col;
      const h = child.height;
      const y = colHeights[col];
      colHeights[col] += h;
      return { ...child, x, y, w: colW, h };
    });
    return { grid: g, totalHeight: Math.max(...colHeights) };
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;
    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };
      if (!hasMounted.current) {
        const init = getInitialPosition(item);
        gsap.fromTo(selector,
          { opacity: 0, x: init.x, y: init.y, width: item.w, height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' }) },
          { opacity: 1, ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8, ease: 'power3.out', delay: index * stagger }
        );
      } else {
        gsap.to(selector, { ...animProps, duration, ease, overwrite: 'auto' });
      }
    });
    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady]);

  const handleMouseEnter = (e, item) => {
    if (scaleOnHover) gsap.to(`[data-key="${item.id}"]`, { scale: hoverScale, duration: 0.3, ease: 'power2.out' });
    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
    if (item.warning) {
      warningTimerRef.current = setTimeout(() => {
        setWarningActive(item.id);
        setWarningStage(1);
        const t2 = setTimeout(() => setWarningStage(2), 500);
        const t3 = setTimeout(() => setWarningStage(3), 1000);
        const t4 = setTimeout(() => setWarningStage(4), 2000);
        stageTimersRef.current = [t2, t3, t4];
      }, 1000);
    }
  };

  const handleMouseLeave = (e, item) => {
    if (scaleOnHover) gsap.to(`[data-key="${item.id}"]`, { scale: 1, duration: 0.3, ease: 'power2.out' });
    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
    clearTimeout(warningTimerRef.current);
    stageTimersRef.current.forEach(t => clearTimeout(t));
    stageTimersRef.current = [];
    setWarningActive(null);
    setWarningStage(0);
  };

  useEffect(() => () => {
    clearTimeout(warningTimerRef.current);
    stageTimersRef.current.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div ref={containerRef} className="list" style={{ height: totalHeight || undefined }}>
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="item-wrapper"
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={e => handleMouseEnter(e, item)}
          onMouseLeave={e => handleMouseLeave(e, item)}
        >
          <div className="item-img" style={{ backgroundImage: item.img ? `url(${item.img})` : 'none', backgroundPosition: item.bgPosition || 'center center' }}>
            <div className="item-info">
              <span className="item-title">{item.title}</span>
              {item.hours && <span className="item-hours">{item.hours}</span>}
            </div>
            {item.warning && warningActive === item.id && (
              <div className="item-warning" data-stage={warningStage}>
                {warningStage === 1 && (
                  <span className="item-warning-s1">！！！</span>
                )}
                {warningStage === 2 && (
                  <span className="item-warning-s2">仇人陷害！！！</span>
                )}
                {warningStage === 3 && (
                  <span className="item-warning-s3">不要碰这个游戏！！！</span>
                )}
                {warningStage === 4 && (
                  <span className="item-warning-s4">邀请好友来玩战争雷霆，好处多多！</span>
                )}
              </div>
            )}
            {colorShiftOnHover && (
              <div className="color-overlay" style={{
                position:'absolute', inset:0,
                background:'linear-gradient(45deg,rgba(255,0,150,0.5),rgba(0,150,255,0.5))',
                opacity:0, pointerEvents:'none', borderRadius:'8px'
              }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
