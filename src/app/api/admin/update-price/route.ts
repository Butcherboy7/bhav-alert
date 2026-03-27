import { NextResponse } from "next/server";
import admin from "firebase-admin";

function getDb() {
  if (!admin.apps.length) {
    try {
      const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!serviceAccountStr) {
        console.warn("FIREBASE_SERVICE_ACCOUNT is not set. Admin API will fail if called.");
        return null;
      }
      const serviceAccount = JSON.parse(serviceAccountStr);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("Firebase admin init error:", error);
      return null;
    }
  }
  return admin.firestore();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, commodity, city, price, change } = body;

    const validUsername = process.env.ADMIN_USERNAME || "uzair";
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!username || !password || username !== validUsername || password !== validPassword) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    if (!commodity || price === undefined || change === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Determine the field path to update
    // e.g., petrol.mumbai.price, or gold.price_24k
    let updateData: Record<string, any> = {};

    if (city) {
      // It's a city-based commodity like petrol or diesel
      updateData[`${commodity}.${city}.price`] = price;
      updateData[`${commodity}.${city}.change`] = change;
    } else {
      // It's a global commodity like gold, lpg, onion
      if (commodity.includes(".")) {
        // e.g. gold.price_24k
        updateData[commodity] = price;
        const changeKey = commodity.replace("price", "change");
        updateData[changeKey] = change;
      } else {
        // e.g. lpg
        updateData[`${commodity}.price`] = price;
        updateData[`${commodity}.change`] = change;
      }
    }

    // Update the 'latest' document
    await db.collection("prices").doc("latest").update(updateData);

    // Provide the Indian standard time string for the actual day document
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(Date.now() + istOffset);
    const todayStr = istTime.toISOString().split("T")[0];

    // Optionally update the today document as well
    try {
      await db.collection("prices").doc(todayStr).update(updateData);
    } catch {
      // Ignore if today doc doesn't exist yet
    }

    return NextResponse.json({ success: true, message: "Price updated" });
  } catch (error: any) {
    console.error("Admin update error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
