"use client";

import { redirect } from "next/navigation";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  redirect(`/sessions/${id}/1`);
}
