type ProgressRingProps = {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ label, current, target, unit, color }: ProgressRingProps) {
  const ratio = target > 0 ? Math.min(current / target, 1) : 0;
  // Deliberately stop just short of a full circle even at 100% — an
  // unbroken ring reads as "closed" and kills the urge to keep going.
  const displayRatio = ratio >= 1 ? 0.97 : ratio;
  const dashOffset = CIRCUMFERENCE * (1 - displayRatio);
  const remaining = Math.max(target - current, 0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="#27272a"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold text-zinc-100">{current}</span>
          <span className="text-[10px] uppercase tracking-wide text-zinc-500">{unit}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        <p className="text-xs text-zinc-500">
          {remaining > 0 ? `${remaining}${unit} left` : "almost there"}
        </p>
      </div>
    </div>
  );
}
