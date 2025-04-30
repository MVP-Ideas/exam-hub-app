"use client";

import { createUserStore, UserState } from "@/lib/stores/user-store";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

type UserStoreApi = ReturnType<typeof createUserStore>;

const UserStoreContext = createContext<UserStoreApi | null>(null);

export const UserStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<UserStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (state: UserState) => T): T => {
  const store = useContext(UserStoreContext);

  if (!store) {
    throw new Error("useUserStore must be used within UserStoreProvider");
  }

  return useStore(store, selector);
};
