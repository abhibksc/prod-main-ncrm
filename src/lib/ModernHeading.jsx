export default function ModernHeading({ text }) {
  return (
    <div className="relative inline-block">
      <h1
        className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-transparent bg-clip-text 
                     bg-gradient-to-r from-gray-200 to-secondary-500 relative"
      >
        {text}
      </h1>
      {/* Curved underline */}
      <div className="absolute w-full h-2 bottom-[-8px] left-0">
        <svg
          width="100%"
          height="10"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,10 C25,0 75,0 100,10"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#d1d5db" /> {/* gray-200 */}
              <stop offset="100%" stopColor="var(--theme-color)" />{" "}
              {/* secondary-500 */}
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
