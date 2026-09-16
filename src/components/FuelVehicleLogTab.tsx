"use client";

import React, { useState, useEffect } from "react";
import { FuelVehicleLog } from "@/lib/operations-types";

interface FuelVehicleLogTabProps {
  adminPasscode: string;
}

export default function FuelVehicleLogTab({ adminPasscode }: FuelVehicleLogTabProps) {
  const [vehicleRegNumber, setVehicleRegNumber] = useState("WR 4821-26");
  const [driverInstructorName, setDriverInstructorName] = useState("Instructor Mensah");
  const [litresPurchased, setLitresPurchased] = useState<number>(25);
  const [amountGHS, setAmountGHS] = useState<number>(380);
  const [odometerKm, setOdometerKm] = useState<number>(45210);
  const [fuelStation, setFuelStation] = useState("GOIL Takoradi Roundabout");
  const [receiptNumber, setReceiptNumber] = useState("RCP-98214");
  const [notes, setNotes] = useState("Daily morning and afternoon training practicals");

  const [instructorList, setInstructorList] = useState<string[]>([
    "Instructor Mensah",
    "Instructor Emmanuel",
    "Instructor Francis",
    "Instructor Kofi",
  ]);

  const [fuelLogs, setFuelLogs] = useState<FuelVehicleLog[]>([
    {
      id: "fuel_1",
      date: new Date().toISOString().split("T")[0],
      vehicleRegNumber: "WR 4821-26",
      driverInstructorName: "Instructor Mensah",
      litresPurchased: 30,
      amountGHS: 450,
      odometerKm: 45180,
      fuelStation: "GOIL Takoradi Circle",
      receiptNumber: "GL-48291",
      notes: "Morning and afternoon field sessions",
      loggedBy: "Admin",
      created_at: new Date().toISOString(),
    },
    {
      id: "fuel_2",
      date: new Date().toISOString().split("T")[0],
      vehicleRegNumber: "WR 1092-26",
      driverInstructorName: "Instructor Emmanuel",
      litresPurchased: 25,
      amountGHS: 375,
      odometerKm: 32450,
      fuelStation: "Shell Market Circle",
      receiptNumber: "SH-10294",
      notes: "Afternoon training slot",
      loggedBy: "Admin",
      created_at: new Date().toISOString(),
    },
  ]);

  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kbdr_instructors_roster");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const names = parsed.map((i: any) => i.name).filter(Boolean);
          if (names.length > 0) {
            setInstructorList(names);
            setDriverInstructorName(names[0]);
          }
        } catch {}
      }
    }
  }, []);

  const totalSpentGHS = fuelLogs.reduce((sum, log) => sum + log.amountGHS, 0);
  const totalLitres = fuelLogs.reduce((sum, log) => sum + log.litresPurchased, 0);

  const handleAddFuelLog = async () => {
    setIsLogging(true);
    try {
      const newEntry: FuelVehicleLog = {
        id: "fuel_" + Date.now(),
        date: new Date().toISOString().split("T")[0],
        vehicleRegNumber,
        driverInstructorName,
        litresPurchased: Number(litresPurchased),
        amountGHS: Number(amountGHS),
        odometerKm: Number(odometerKm),
        fuelStation,
        receiptNumber,
        notes,
        loggedBy: "Admin",
        created_at: new Date().toISOString(),
      };

      await fetch("/api/admin/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + adminPasscode,
        },
        body: JSON.stringify({
          action: "LOG_FUEL_PURCHASE",
          payload: newEntry,
        }),
      });

      setFuelLogs((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      {/* Fuel Entry Form (5 Cols) */}
      <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>⛽ Log Fuel & Vehicle Expense</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              Fleet Tracker
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Track fuel purchases, odometer, and receipt numbers for fleet accountability
          </p>

          <div className="mt-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Vehicle Plate #
                </label>
                <input
                  type="text"
                  value={vehicleRegNumber}
                  onChange={(e) => setVehicleRegNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Driver / Instructor
                </label>
                <select
                  value={driverInstructorName}
                  onChange={(e) => setDriverInstructorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  {instructorList.map((name, i) => (
                    <option key={i} value={name}>
                      👤 {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Litres Purchased (L)
                </label>
                <input
                  type="number"
                  value={litresPurchased}
                  onChange={(e) => setLitresPurchased(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Total Amount (GH₵)
                </label>
                <input
                  type="number"
                  value={amountGHS}
                  onChange={(e) => setAmountGHS(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-amber-700 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Odometer (KM)
                </label>
                <input
                  type="number"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Receipt # / Reference
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-700 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Fuel Station / Vendor
              </label>
              <input
                type="text"
                value={fuelStation}
                onChange={(e) => setFuelStation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Notes & Purpose
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAddFuelLog}
          disabled={isLogging}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {isLogging ? "Saving Fuel Log..." : "💾 Record Fuel Expense"}
        </button>
      </div>

      {/* Fuel History & Summaries (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {/* KPI Summaries */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fuel Spend</span>
            <span className="text-xl font-black text-slate-900">GH₵ {totalSpentGHS.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Litres</span>
            <span className="text-xl font-black text-amber-700">{totalLitres} L</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Receipts Logged</span>
            <span className="text-xl font-black text-sky-700">{fuelLogs.length} Receipts</span>
          </div>
        </div>

        {/* Log Table */}
        <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <h4 className="font-bold text-xs text-slate-900 mb-2">Recent Fuel Purchases & Receipts</h4>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {fuelLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 p-2 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{log.vehicleRegNumber}</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {log.receiptNumber}
                    </span>
                    <span className="text-slate-400 text-[11px]">{log.date}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    <span>⛽ {log.fuelStation}</span> • <span>👤 {log.driverInstructorName}</span> • <span>🚗 {log.odometerKm} KM</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-sm text-amber-700">GH₵ {log.amountGHS}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{log.litresPurchased} Litres</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
