import { cn } from "@/lib/utils";

interface MarkProps {
  className?: string;
}

const redEye = "#FF3B30";
const blueEye = "#29A9FF";

export function WolfBrandMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn("h-10 w-10 overflow-visible", className)}
      role="img"
      aria-label="w0lf.exe wolf brand mark"
      fill="none"
    >
      <defs>
        <filter id="mini-red" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="mini-blue" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g stroke="#8794A3" strokeWidth="1.15" strokeLinejoin="round">
        <path d="M10 6 29 15 40 9 51 15 70 6 63 32 72 52 55 49 40 74 25 49 8 52 17 32Z" fill="#0D141D" />
        <path d="M10 6 29 15 24 36 17 32Z" fill="#27323D" />
        <path d="M70 6 51 15 56 36 63 32Z" fill="#2D3B49" />
        <path d="M29 15 40 9 40 38 24 36Z" fill="#17212B" />
        <path d="M51 15 40 9 40 38 56 36Z" fill="#1E2D3A" />
        <path d="M24 36 36 42 25 49 8 52Z" fill="#111923" />
        <path d="M56 36 44 42 55 49 72 52Z" fill="#142333" />
        <path d="M34 54 40 48 46 54 40 66Z" fill="#070C11" />
        <path d="M35 31 40 34 45 31M40 38v30" stroke="#65717E" />
        <path d="M18 20 24 26M62 20 56 26M31 18v9M49 18v9" stroke="#5C6976" opacity="0.8" />
      </g>
      <path d="M28 40 37 42 31 47Z" fill={redEye} filter="url(#mini-red)" />
      <path d="M52 40 43 42 49 47Z" fill={blueEye} filter="url(#mini-blue)" />
    </svg>
  );
}

export function HeroWolfIllustration({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 1080 760"
      className={cn("h-full w-full overflow-visible", className)}
      role="img"
      aria-label="Faceted cyber wolf illustration"
      fill="none"
    >
      <defs>
        <linearGradient id="left-steel" x1="180" y1="70" x2="540" y2="700">
          <stop stopColor="#85929F" />
          <stop offset="0.45" stopColor="#25303B" />
          <stop offset="1" stopColor="#080D13" />
        </linearGradient>
        <linearGradient id="right-steel" x1="900" y1="70" x2="540" y2="700">
          <stop stopColor="#93A4B5" />
          <stop offset="0.45" stopColor="#273B4F" />
          <stop offset="1" stopColor="#08111B" />
        </linearGradient>
        <linearGradient id="center-steel" x1="540" y1="90" x2="540" y2="720">
          <stop stopColor="#A4AFBB" stopOpacity="0.9" />
          <stop offset="1" stopColor="#394653" stopOpacity="0.58" />
        </linearGradient>
        <filter id="red-glow" x="-140%" y="-140%" width="380%" height="380%">
          <feGaussianBlur stdDeviation="13" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 1  0 0.16 0 0 0.05  0 0 0.12 0 0.04  0 0 0 0.85 0" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="blue-glow" x="-140%" y="-140%" width="380%" height="380%">
          <feGaussianBlur stdDeviation="13" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0.28 0 0.05  0 0.58 0 0 0.45  0 0 1 0 1  0 0 0 0.9 0" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="line-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" result="soft" />
          <feMerge><feMergeNode in="soft" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g className="hero-circuit-grid" strokeLinecap="round" strokeLinejoin="round" filter="url(#line-glow)">
        <g stroke="#526676" opacity="0.44">
          <path d="M352 296H202l-46-46H76" />
          <path d="M322 352H188l-44-44H58" />
          <path d="M336 450H180l-44 44H54" />
          <path d="M402 570 322 650h-88" />
          <path d="M298 218 230 150h-78l-30-30H72" />
          <circle cx="76" cy="250" r="5" />
          <circle cx="58" cy="308" r="5" />
          <circle cx="54" cy="494" r="5" />
        </g>
        <g stroke="#1284D6" opacity="0.55">
          <path d="M728 296h150l46-46h82" />
          <path d="M758 352h134l44-44h86" />
          <path d="M744 450h156l44 44h82" />
          <path d="M678 570 758 650h88" />
          <path d="M782 218 850 150h78l30-30h50" />
          <circle cx="1006" cy="250" r="5" />
          <circle cx="1022" cy="308" r="5" />
          <circle cx="1026" cy="494" r="5" />
        </g>
        <g stroke="#607080" opacity="0.38">
          <path d="M522 180V76l-32-32" />
          <path d="M558 180V94l34-34V22" />
          <path d="M540 610v122" />
        </g>
      </g>

      <g className="wolf-poster" strokeLinejoin="round" strokeLinecap="round">
        <g stroke="#A2AEBA" strokeWidth="1.35">
          <path d="M96 44 260 168 356 136 540 186 724 136 820 168 984 44 898 344 954 468 748 454 664 566 592 548 540 728 488 548 416 566 332 454 126 468 182 344Z" fill="#071019" fillOpacity="0.18" />
        </g>

        <g stroke="#A4AFBA" strokeWidth="1.1">
          <path d="M96 44 260 168 218 320 182 344Z" fill="#2E3944" />
          <path d="M984 44 820 168 862 320 898 344Z" fill="#344554" />
          <path d="M260 168 356 136 334 292 218 320Z" fill="#222C37" />
          <path d="M820 168 724 136 746 292 862 320Z" fill="#25384A" />
          <path d="M356 136 540 186 540 342 334 292Z" fill="url(#left-steel)" />
          <path d="M724 136 540 186 540 342 746 292Z" fill="url(#right-steel)" />
          <path d="M218 320 334 292 316 454 126 468Z" fill="#161F29" />
          <path d="M862 320 746 292 764 454 954 468Z" fill="#142638" />
          <path d="M334 292 540 342 430 452 316 454Z" fill="#25303A" />
          <path d="M746 292 540 342 650 452 764 454Z" fill="#2C4154" />
          <path d="M316 454 430 452 416 566 332 454Z" fill="#0D151E" />
          <path d="M764 454 650 452 664 566 748 454Z" fill="#0E1D2D" />
          <path d="M430 452 540 506 416 566Z" fill="#2A3540" />
          <path d="M650 452 540 506 664 566Z" fill="#2D4559" />
          <path d="M416 566 540 506 540 728 488 548Z" fill="#090E14" />
          <path d="M664 566 540 506 540 728 592 548Z" fill="#0B1724" />
          <path d="M480 576 540 528 600 576 540 652Z" fill="#05090E" />
          <path d="M480 576 540 652 432 664Z" fill="#101821" />
          <path d="M600 576 540 652 648 664Z" fill="#122234" />
          <path d="M126 468 316 454 230 524Z" fill="#141B24" />
          <path d="M954 468 764 454 850 524Z" fill="#122333" />
        </g>

        <g className="wolf-technical-lines" stroke="#A8B3BE" strokeWidth="1.3" opacity="0.78">
          <path d="M222 96 284 190 270 270" />
          <path d="M858 96 796 190 810 270" />
          <path d="M410 148 496 236v106" />
          <path d="M670 148 584 236v106" />
          <path d="M516 176v170" />
          <path d="M564 176v170" />
          <path d="M278 404h72l58 42" />
          <path d="M802 404h-72l-58 42" />
          <path d="M498 678h84" />
          <circle cx="270" cy="270" r="3" />
          <circle cx="810" cy="270" r="3" />
          <circle cx="408" cy="446" r="3" />
          <circle cx="672" cy="446" r="3" />
          <circle cx="540" cy="678" r="3" />
        </g>

        <g stroke="url(#center-steel)" strokeWidth="2" opacity="0.85">
          <path d="M540 186v156" />
          <path d="M540 506v222" />
          <path d="M512 206v108M568 206v108" />
          <path d="M492 258v86M588 258v86" />
          <path d="M520 150v38M560 150v38" />
        </g>

        <path d="M386 430 506 448 440 506 332 470Z" fill="#080E15" stroke={redEye} strokeWidth="1.6" filter="url(#red-glow)" />
        <path d="M694 430 574 448 640 506 748 470Z" fill="#08101A" stroke={blueEye} strokeWidth="1.6" filter="url(#blue-glow)" />
        <path d="M416 452 476 460 436 492Z" fill={redEye} filter="url(#red-glow)" />
        <path d="M664 452 604 460 644 492Z" fill={blueEye} filter="url(#blue-glow)" />
      </g>
    </svg>
  );
}
