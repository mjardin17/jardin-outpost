type LossVaultProps = {
  streakDays: number;
  stakePerDay: number;
  maxStake: number;
};

export default function LossVault({ streakDays, stakePerDay, maxStake }: LossVaultProps) {
  const atRisk = Math.min(streakDays * stakePerDay, maxStake);
  const isHighStakes = atRisk >= maxStake * 0.6;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isHighStakes ? "border-red-500/50 bg-red-500/5" : "border-zinc-800 bg-zinc-950"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Loss Vault</p>
        <span className={`text-xs ${isHighStakes ? "text-red-400" : "text-zinc-500"}`}>
          {streakDays}-day streak
        </span>
      </div>
      <p className={`mt-2 text-3xl font-bold ${isHighStakes ? "text-red-400" : "text-zinc-100"}`}>
        ${atRisk.toFixed(2)}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        {isHighStakes
          ? "That's real money walking out the door if you skip today."
          : "Your stake grows the longer you stay consistent. Don't reset it."}
      </p>
    </div>
  );
}
