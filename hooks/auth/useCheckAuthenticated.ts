import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/components/providers/user-store-provider";
import { UserState } from "@/lib/stores/user-store";

export default function useCheckAuthenticated() {
  const { user } = useUserStore((state: UserState) => ({
    user: state.user,
  }));
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);
}
