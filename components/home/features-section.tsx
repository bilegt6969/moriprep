"use client";

export default function AtomizeHero() {
  return (
    <section className="w-full min-h-screen bg-white flex flex-col items-center pt-20 px-6 font-sans antialiased select-none">
      {/* Top Typography Section */}
      <div className="w-full max-w-[1050px] text-center mb-16">
        <h1 className="text-[2.25rem] md:text-[3.25rem] lg:text-[4rem] font-bold leading-[1.1] tracking-[-0.03em]">
          {/* Line 1 */}
          <div className="text-black">
            Sick of 💸 greedy prep centers and finding zero 🇲🇳 Mongolian dSAT
            resources?
          </div>

          {/* Line 2 */}
          <div className="text-black mt-4">
            We said screw it and built Mori Prep.
          </div>
        </h1>
      </div>

      {/* Bottom Component Card */}
      <div className="w-full max-w-[840px] bg-[#fdfdfd] border border-gray-100/80 rounded-[2.5rem] pt-20 pb-12 px-8 flex flex-col items-center shadow-[0_4px_40px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {/* Card Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 tracking-tight">
          1500+ Components and Variants
        </h2>
        <p className="text-[#9ca3af] font-medium text-base md:text-lg mb-16 tracking-tight">
          Buttons, Inputs, Dropdowns, Navigations, Web3, and more
        </p>

        {/* Floating Component Pill */}
        <div className="bg-white rounded-full p-2.5 pr-4 pl-4 flex items-center justify-between gap-4 md:gap-6 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 w-max max-w-full overflow-x-auto no-scrollbar mx-auto">
          {/* 1. Toggle Switch */}
          <div className="w-11 h-6 bg-gray-200 rounded-full flex items-center p-0.5 border border-gray-300/50 flex-shrink-0 shadow-inner">
            <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>

          {/* 2. Pink Checkbox */}
          <div className="w-[22px] h-[22px] bg-[#e03aeb] rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* 3. Pepe / Meme Icon (Approximation) */}
          <div className="text-[26px] leading-none flex-shrink-0 drop-shadow-sm">
            🐸
          </div>

          {/* 4. Pink Image Placeholder Icon */}
          <div className="w-[30px] h-[30px] bg-[#fae8f8] rounded-full flex items-center justify-center text-[#e03aeb] flex-shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>

          {/* 5. Select Dropdown */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-700 flex-shrink-0 cursor-pointer hover:bg-gray-50">
            Select option
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* 6. Overlapping Avatars/Icons */}
          <div className="flex -space-x-2.5 flex-shrink-0">
            {/* Discord */}
            <div className="w-8 h-8 rounded-full bg-[#5865F2] border-2 border-white flex items-center justify-center z-[1]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
              </svg>
            </div>
            {/* Crypto Coin */}
            <div className="w-8 h-8 rounded-full bg-[#fcd34d] border-2 border-white flex items-center justify-center z-[2]">
              <span className="text-[#b45309] font-bold text-sm tracking-tighter leading-none">
                🪙
              </span>
            </div>
            {/* Avatar Emoji */}
            <div className="w-8 h-8 rounded-full bg-[#fde68a] border-2 border-white flex items-center justify-center text-lg z-[3]">
              🧑‍🎤
            </div>
          </div>

          {/* 7. Pink Button */}
          <div className="px-4 py-2.5 rounded-full bg-[#fae8f8] text-[#e03aeb] text-[13px] font-bold tracking-wide flex-shrink-0 ml-2">
            Primary Light
          </div>

          {/* 8. Mastercard-style Icon */}
          <div className="flex -space-x-1.5 px-2 py-1 bg-white border border-gray-100 rounded-full flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-[#ef4444] mix-blend-multiply opacity-90" />
            <div className="w-4 h-4 rounded-full bg-[#f59e0b] mix-blend-multiply opacity-90" />
          </div>
        </div>
      </div>
    </section>
  );
}
