import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/auth";

const ELECTORAL_AREAS_STANDARD = [
  "Amanful West",
  "Amanful East",
  "Beach Road",
  "Essikafo Ambitem No. 1",
  "Essikafo Ambitem No. 2",
  "Chapel Hill",
  "Railway & Harbour",
  "New-Takoradi Lower",
  "Poasi - Upper New-Takoradi",
  "Airforce ( Airforce, adakope, kokompe & princess)",
  "Old Adra",
  "Cassava Farm",
  "Zenith",
  "Airport Ridge",
  "Presby",
  "Other",
];

function normalizeArea(rawArea: string | null | undefined): string {
  if (!rawArea || !rawArea.trim()) return "Other";
  const clean = rawArea.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  if (clean.includes("amanfulwest")) return "Amanful West";
  if (clean.includes("amanfuleast")) return "Amanful East";
  if (clean.includes("beachroad")) return "Beach Road";
  if (clean.includes("essikafo") && clean.includes("1")) return "Essikafo Ambitem No. 1";
  if (clean.includes("essikafo") && clean.includes("2")) return "Essikafo Ambitem No. 2";
  if (clean.includes("chapel") || clean.includes("chaple")) return "Chapel Hill";
  if (clean.includes("railway") || clean.includes("harbour")) return "Railway & Harbour";
  if (clean.includes("newtakoradi") && clean.includes("lower")) return "New-Takoradi Lower";
  if (clean.includes("poasi") || (clean.includes("newtakoradi") && clean.includes("upper"))) return "Poasi - Upper New-Takoradi";
  if (clean.includes("airforce") || clean.includes("adakope") || clean.includes("kokompe") || clean.includes("princess")) {
    return "Airforce ( Airforce, adakope, kokompe & princess)";
  }
  if (clean.includes("oldadra") || clean.includes("adra")) return "Old Adra";
  if (clean.includes("cassava")) return "Cassava Farm";
  if (clean.includes("zenith")) return "Zenith";
  if (clean.includes("airport")) return "Airport Ridge";
  if (clean.includes("presby")) return "Presby";

  return rawArea.trim();
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Passcode required." },
        { status: 401 }
      );
    }

    const supabase = getServiceSupabase();

    // Fetch all applications' electoral area & status for complete summary
    const { data: records, error } = await supabase
      .from("kbdr_applications")
      .select("electoral_area, status");

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Initialize counts map for standard electoral areas
    const areaStatsMap: Record<
      string,
      {
        area: string;
        registered: number;
        approved: number;
        in_training: number;
        completed: number;
        trained: number; // approved + in_training + completed
        rejected: number;
        pending: number; // pending + under_review
      }
    > = {};

    ELECTORAL_AREAS_STANDARD.forEach((area) => {
      areaStatsMap[area] = {
        area,
        registered: 0,
        approved: 0,
        in_training: 0,
        completed: 0,
        trained: 0,
        rejected: 0,
        pending: 0,
      };
    });

    let totalRegistered = 0;
    let totalTrained = 0;
    let totalApproved = 0;
    let totalInTraining = 0;
    let totalCompleted = 0;
    let totalRejected = 0;
    let totalPending = 0;

    (records || []).forEach((row) => {
      const area = normalizeArea(row.electoral_area);
      if (!areaStatsMap[area]) {
        areaStatsMap[area] = {
          area,
          registered: 0,
          approved: 0,
          in_training: 0,
          completed: 0,
          trained: 0,
          rejected: 0,
          pending: 0,
        };
      }

      const item = areaStatsMap[area];
      item.registered++;
      totalRegistered++;

      const s = (row.status || "pending").toLowerCase();
      if (s === "approved") {
        item.approved++;
        item.trained++;
        totalApproved++;
        totalTrained++;
      } else if (s === "in_training") {
        item.in_training++;
        item.trained++;
        totalInTraining++;
        totalTrained++;
      } else if (s === "completed") {
        item.completed++;
        item.trained++;
        totalCompleted++;
        totalTrained++;
      } else if (s === "rejected") {
        item.rejected++;
        totalRejected++;
      } else {
        // pending, under_review
        item.pending++;
        totalPending++;
      }
    });

    // Convert map to sorted array (standard electoral areas order + any custom)
    const breakdown = Object.values(areaStatsMap).sort((a, b) => {
      // standard order first, then highest registered
      const idxA = ELECTORAL_AREAS_STANDARD.indexOf(a.area);
      const idxB = ELECTORAL_AREAS_STANDARD.indexOf(b.area);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b.registered - a.registered;
    });

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalRegistered,
          totalTrained,
          totalApproved,
          totalInTraining,
          totalCompleted,
          totalRejected,
          totalPending,
        },
        breakdown,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Summary GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
