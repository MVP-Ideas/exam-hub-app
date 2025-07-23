import LearnerMetrics from "./LearnerMetrics";

export default function PlatformMetrics() {
  return (
    <div className="flex h-full w-full flex-1 flex-col gap-6 rounded-lg">
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-xl font-semibold">Learner Metrics</h2>
        <LearnerMetrics />
      </div>
    </div>
  );
}
