"use client";

import React from "react";
import { useSchedule } from "@/context/ScheduleContext";
import CustomToast from "@/components/ui/custom-toast";

export default function Toast() {
  const { toast, hideToast } = useSchedule();

  return (
    <CustomToast
      show={!!toast?.show}
      type={toast?.type || "success"}
      message={toast?.message || ""}
      onClose={hideToast}
    />
  );
}