"use client";

import AllExams from "@/components/learner/exams/AllExams";
import ExamCategorySelect from "@/components/learner/exams/ExamCategorySelect";
import ExamDifficultySelect from "@/components/learner/exams/ExamDifficultySelect";
import FeaturedExams from "@/components/learner/exams/FeaturedExams";
import LearningJourney from "@/components/learner/exams/LearningJourney";
import { Input } from "@/components/ui/input";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const showOtherSections =
    debouncedSearch === "" && activeCategory === null && difficulty === null;

  return (
    <div className="flex h-full max-w-full flex-1 flex-col">
      <div className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-violet-600 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10">
          <div>
            <h1 className="text-3xl font-bold">Available Exams</h1>
            <p>Select an exam to begin your practice and enhance your skills</p>
          </div>

          <div className="mb-2 flex flex-col items-center gap-4">
            <Input
              icon={<Search className="h-5 w-5 text-white opacity-70" />}
              type="text"
              placeholder="Search exams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full w-full rounded-lg border border-white/10 bg-white/10 text-base text-white backdrop-blur-sm placeholder:text-white focus:ring-1 focus:ring-white/10 focus:outline-none"
            />
            <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
              <ExamCategorySelect
                value={activeCategory}
                onChange={(value) => {
                  if (value === "") {
                    setActiveCategory(null);
                  } else {
                    setActiveCategory(value);
                  }
                }}
              />
              <ExamDifficultySelect
                includeNull
                value={difficulty}
                onChange={(value) => {
                  if (value === "" || value === "null") {
                    setDifficulty(null);
                  } else {
                    setDifficulty(value);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {showOtherSections && <LearningJourney />}
      {showOtherSections && <FeaturedExams />}
      <AllExams
        difficulty={difficulty ?? ""}
        search={debouncedSearch}
        category={activeCategory ?? ""}
      />
    </div>
  );
}
