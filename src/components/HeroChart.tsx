import { useEffect, useRef } from 'react';

function restartChartAnimations(root: HTMLElement) {
  const targets = root.querySelectorAll<SVGElement>(
    '.chart-line-path, .chart-bar, .chart-dot-highlight',
  );
  targets.forEach((el) => {
    el.style.animation = 'none';
  });
  void root.offsetWidth;
  targets.forEach((el) => {
    el.style.animation = '';
  });
}

export default function HeroChart() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = visualRef.current;
    if (!root) return;

    const play = () => {
      root.classList.remove('is-chart-ready');
      restartChartAnimations(root);
      window.setTimeout(() => {
        root.classList.add('is-chart-ready');
      }, 480);
    };

    play();

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) play();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  return (
    <div className="hero-visual" ref={visualRef} aria-hidden="true">
      <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
        <line x1="25" y1="15" x2="25" y2="135" className="chart-grid" />
        <rect x="35" y="120" width="14" height="15" rx="3" className="chart-bar chart-bar-1" />
        <rect x="57" y="105" width="14" height="30" rx="3" className="chart-bar chart-bar-2" />
        <rect x="79" y="85" width="14" height="50" rx="3" className="chart-bar chart-bar-3" />
        <rect x="101" y="65" width="14" height="70" rx="3" className="chart-bar chart-bar-4" />
        <rect x="123" y="45" width="14" height="90" rx="3" className="chart-bar chart-bar-5" />
        <rect x="145" y="25" width="14" height="110" rx="3" className="chart-bar chart-bar-6" />
        <polyline
          pathLength={100}
          points="28,120 42,120 64,105 86,85 108,65 130,45 152,25 175,15"
          className="chart-line-path"
        />
        <circle cx="175" cy="15" r="5" className="chart-dot-highlight" />
      </svg>
    </div>
  );
}
