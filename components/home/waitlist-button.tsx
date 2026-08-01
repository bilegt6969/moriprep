import Link from "next/link";

interface GlassyWaitlistButtonProps {
  href: string;
}

export default function GlassyWaitlistButton({
  href,
}: GlassyWaitlistButtonProps) {
  return (
    <Link href={href}>
      <button
        className="
          group relative flex items-center justify-center gap-2 rounded-full
          /* Plump padding to match the screenshot's proportions */
          px-8 py-3.5
          
          /* Typography */
          font-sans text-[18px] font-semibold tracking-[-0.02em] text-white
          
          /* The Base Surface: A vertical gradient simulating a rounded physical object */
          bg-gradient-to-b from-[#1F6EFF] to-[#0042FF]
          
          /* 
            The Glass/3D Magic: Stacked Box Shadows 
            1. Top reflection rim (inset white)
            2. Bottom volume shadow (inset dark blue/black)
            3. Outer ambient glow (drop shadow)
          */
          shadow-[inset_0_2px_2px_rgba(255,255,255,0.5),_inset_0_-4px_6px_rgba(0,20,120,0.3),_0_12px_25px_-4px_rgba(0,85,255,0.4)]
          
          /* Smooth state transitions */
          transition-all duration-300 ease-out
          hover:scale-[1.02] hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.6),_inset_0_-4px_6px_rgba(0,20,120,0.3),_0_16px_32px_-4px_rgba(0,85,255,0.5)]
          active:scale-[0.98] active:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_inset_0_-2px_4px_rgba(0,20,120,0.3),_0_6px_15px_-4px_rgba(0,85,255,0.4)]
        "
      >
        {/* 
          Optional: Sweeping Glass Glare Animation 
          This adds a dynamic shine that sweeps across the button on hover
        */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <div
            className="
              absolute -inset-full top-0 z-0 block h-full w-1/2 
              -left-[150%] rotate-12 transform 
              bg-gradient-to-r from-transparent via-white/20 to-transparent 
              opacity-0 transition-all duration-700 ease-in-out
              group-hover:left-[150%] group-hover:opacity-100
            "
          />
        </div>

        {/* Text */}
        <span className="relative z-10 drop-shadow-sm">Start practicing</span>

        {/* 
          Chevron Icon 
          Features slightly rounded stroke corners and a smooth hover slide 
        */}
        <svg
          className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-[4px]"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </Link>
  );
}
