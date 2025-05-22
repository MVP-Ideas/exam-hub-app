"use client";

import useExamSessionById from "@/hooks/exam-sessions/useExamSessionById";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const { examSession, isLoading, isError } = useExamSessionById(id as string);

  return <div>{examSession?.totalScore}</div>;
}
