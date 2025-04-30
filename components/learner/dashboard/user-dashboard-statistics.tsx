import { TrendingUp, CheckCircle, Clock, Award } from "lucide-react";

export default function UserDashboardStatistics() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <h2 className="text-foreground mb-6 text-xl font-bold">Your Progress</h2>
      <div className="flex flex-col gap-6">
        <div className="bg-background rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-indigo-100 p-3">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-muted-foreground text-sm font-medium">
                Average Score
              </p>
              <p className="text-foreground text-2xl font-bold">85%</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `80%` }}
            ></div>
          </div>
        </div>

        <div className="bg-background rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-muted-foreground text-sm font-medium">
                Exams Completed
              </p>
              <p className="text-foreground text-2xl font-bold">10</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-muted-foreground text-sm font-medium">
                Study Time
              </p>
              <p className="text-foreground text-2xl font-bold">
                2 hours 30 minutes
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-amber-100 p-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-muted-foreground text-sm font-medium">
                Achievements
              </p>
              <p className="text-foreground text-2xl font-bold">14</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
