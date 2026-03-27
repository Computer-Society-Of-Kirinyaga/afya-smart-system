export function SharedStyles() {
  return (
    <style>{`
      body {
        font-family: 'Inter', sans-serif;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      :root {
        --gx-1: 6%;
        --gx-2: 28%;
        --gx-3: 62%;
        --gx-4: 94%;
        --gy-1: 100px;
        --gy-2: 62vh;
        --gy-3: 94vh;
        --grid-color: rgba(0, 0, 0, 0.04);
        --beam-color: #0ea5e9;
      }
      .grid-line-v {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--grid-color);
        z-index: 0;
      }
      .grid-line-h {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--grid-color);
        z-index: 0;
      }
      .marker {
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: #0f172a;
        z-index: 30;
        opacity: 0;
        animation: fade-in 0.5s ease-out 1s forwards;
      }
      @keyframes reveal-up {
        0% {
          clip-path: inset(100% 0 0 0);
          transform: translateY(20px);
          opacity: 0;
        }
        100% {
          clip-path: inset(0 0 0 0);
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      .animate-reveal {
        opacity: 0;
        animation: reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .scroll-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .scroll-reveal.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
      .delay-100 {
        animation-delay: 0.1s;
        transition-delay: 0.1s;
      }
      .delay-200 {
        animation-delay: 0.2s;
        transition-delay: 0.2s;
      }
      .delay-300 {
        animation-delay: 0.3s;
        transition-delay: 0.3s;
      }
      .delay-500 {
        animation-delay: 0.5s;
        transition-delay: 0.5s;
      }
      @keyframes beam-h {
        0% {
          left: -200px;
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          left: 100%;
          opacity: 0;
        }
      }
      @keyframes beam-v {
        0% {
          top: -200px;
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          top: 100%;
          opacity: 0;
        }
      }
      .beam-h {
        position: absolute;
        height: 1px;
        width: 200px;
        background: linear-linear(
          90deg,
          transparent,
          var(--beam-color),
          transparent
        );
        z-index: 10;
        opacity: 0;
      }
      .beam-v {
        position: absolute;
        width: 1px;
        height: 200px;
        background: linear-linear(
          180deg,
          transparent,
          var(--beam-color),
          transparent
        );
        z-index: 10;
        opacity: 0;
      }
      #mobile-menu {
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
      }
      #mobile-menu.hidden-menu {
        transform: translateY(-20px);
        opacity: 0;
        pointer-events: none;
      }
      #mobile-menu.visible-menu {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
      .mask-linear-fade {
        mask-image: linear-linear(
          to right,
          transparent,
          black 15%,
          black 85%,
          transparent
        );
        -webkit-mask-image: linear-linear(
          to right,
          transparent,
          black 15%,
          black 85%,
          transparent
        );
      }
      @keyframes marquee-scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      .animate-marquee {
        animation: marquee-scroll 30s linear infinite;
      }
    `}</style>
  )
}
