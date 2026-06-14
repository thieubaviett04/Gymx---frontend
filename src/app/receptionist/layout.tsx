"use client";

import React from "react";
import { ScheduleProvider } from "@/context/ScheduleContext";
import { ReceptionistLayout } from "@/components/receptionist-layout";

export default function ReceptionistLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScheduleProvider>
      <ReceptionistLayout>{children}</ReceptionistLayout>
    </ScheduleProvider>
  );
}
