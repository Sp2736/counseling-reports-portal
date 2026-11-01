"use client";

import React from "react";
import { DemoProvider } from "@/src/lib/demo-context";
import DemoWelcomeModal from "./DemoWelcomeModal";
import DemoRoleSwitchModal from "./DemoRoleSwitchModal";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <DemoWelcomeModal />
      <DemoRoleSwitchModal />
      {children}
    </DemoProvider>
  );
}
