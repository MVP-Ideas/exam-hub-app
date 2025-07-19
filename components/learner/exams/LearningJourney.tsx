import { Award, Flame, Trophy } from "lucide-react";

export default function LearningJourney() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8">
      <h2 className="text-foreground mb-6 text-xl font-bold">
        Your Learning Journey
      </h2>

      <p className="mb-6 text-sm text-gray-500">
        Track your progress and earn certificates with each exam
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Exams Completed</div>
            <div className="text-2xl font-bold text-gray-900">{8}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg bg-orange-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-2xl font-bold text-gray-900">{1} days</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg bg-purple-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Certificates Earned</div>
            <div className="text-2xl font-bold text-gray-900">{7}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
