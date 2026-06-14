"use client";

import React from "react";
import EmployeeInfoPanel from "@/components/receptionist/employee-info-panel";
import WeekSelector from "@/components/receptionist/week-selector";
import ShiftGridTable from "@/components/receptionist/shift-grid-table";
import ConfirmDialog from "@/components/receptionist/confirm-dialog";
import Toast from "@/components/receptionist/toast";
import MockTimeController from "@/components/receptionist/mock-time-controller";

export default function ReceptionistSchedulePage() {
  return (
    <div className="space-y-6 animate-in fade-in select-none duration-300 max-w-7xl mx-auto">
      {/* Employee Info Panel */}
      <EmployeeInfoPanel />

      {/* Week Selector Panel */}
      <WeekSelector />

      {/* Shifts Grid Registration Table */}
      <ShiftGridTable />

      {/* Overlays and Floating Widgets */}
      <ConfirmDialog />
      <Toast />
      <MockTimeController />
    </div>
  );
}
