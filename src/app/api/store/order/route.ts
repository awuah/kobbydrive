import { NextRequest, NextResponse } from "next/server";
import { recordAdminActivity } from "@/lib/activity-logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      deliveryOption,
      deliveryAddress,
      paymentMethod,
      items,
      totalAmountGHS,
    } = body;

    if (!customerName || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name, phone number, and items are required." },
        { status: 400 }
      );
    }

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `ORD-2026-${randNum}`;

    const itemsSummary = items
      .map((it: any) => `${it.quantity}x ${it.name} (GH₵${it.price * it.quantity})`)
      .join(", ");

    try {
      await recordAdminActivity({
        admin: { id: "store-customer", name: customerName, role: "system" },
        action: "STORE_ORDER_PLACED",
        notes: `Merchandise Store Order (${orderRef}) placed by ${customerName} (Tel: ${phone}). Items: ${itemsSummary}. Total: GH₵${totalAmountGHS}. Delivery: ${deliveryOption}. Payment: ${paymentMethod}.`,
      });
    } catch (e) {
      console.warn("Could not log store order activity:", e);
    }

    return NextResponse.json({
      success: true,
      orderRef,
      message: "Order placed successfully! You will receive a pickup / delivery confirmation SMS shortly.",
    });
  } catch (err: any) {
    console.error("Store Order POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
