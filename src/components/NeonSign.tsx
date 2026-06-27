export default function NeonSign() {
  return (
    <a
      href="#top"
      className="neon-sign group [perspective:500px]"
      aria-label="Jardin's Outpost home"
    >
      <span
        className="neon-sign-text font-display text-lg tracking-tight [transform-style:preserve-3d] transition-transform duration-500 ease-out group-hover:[transform:translateZ(28px)_rotateX(6deg)_rotateY(-10deg)]"
        data-text="Jardin's Outpost"
      >
        Jardin&rsquo;s <span className="italic">Outpost</span>
      </span>
    </a>
  );
}
