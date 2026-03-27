import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DayPrices, DisplayPrice, CityPrice } from "@/types";
import { CACHE_KEY, CACHE_DURATION_MS, CACHE_STALE_MS } from "@/lib/constants";

let cachedPrices: DayPrices | null = null;
let cacheTimestamp: number = 0;

export const getTodayIST = (): string => {
  const date = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(date.getTime() + istOffset);
  return istTime.toISOString().split("T")[0];
};

const fetchFromFirestore = async (): Promise<DayPrices | null> => {
  console.log("Fetching from Firestore... API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "EXISTS" : "MISSING");
  console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  try {
    // Try 'latest' document first
    const latestDocRef = doc(db, "prices", "latest");
    const latestDoc = await getDoc(latestDocRef);

    if (latestDoc.exists()) {
      const data = latestDoc.data() as DayPrices;
      console.log("✅ Latest doc found:", data);
      return data;
    }
    console.log("⚠️ Latest doc not found, checking today...");

    // Fallback to today's date document
    const today = getTodayIST();
    const todayDocRef = doc(db, "prices", today);
    const todayDoc = await getDoc(todayDocRef);

    if (todayDoc.exists()) {
      const data = todayDoc.data() as DayPrices;
      console.log("✅ Today doc found:", data);
      return data;
    }

    console.log("❌ No documents found in Firestore at prices/latest or prices/" + today);
    return null;
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return null;
  }
};

export const fetchPrices = async (): Promise<DayPrices | null> => {
  const now = Date.now();

  // 1. Check in-memory cache
  if (cachedPrices && now - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedPrices;
  }

  // 2. Check localStorage cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        if (now - timestamp < CACHE_DURATION_MS) {
          cachedPrices = data;
          cacheTimestamp = timestamp;
          return data;
        }
      }
    } catch (e) {
      console.warn("LocalStorage access failed", e);
    }
  }

  // 3. Fetch from Firestore
  const prices = await fetchFromFirestore();

  if (prices) {
    cachedPrices = prices;
    cacheTimestamp = now;

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: prices, timestamp: now })
        );
      } catch (e) {
        console.warn("Failed to save to localStorage", e);
      }
    }
    return prices;
  }

  // 4. On failure, return stale cache if within stale limit
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        if (now - timestamp < CACHE_STALE_MS) {
          return data;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return cachedPrices; // Fallback to last known in-memory state
};

export const getCityPrices = (allPrices: DayPrices, cityKey: string): DisplayPrice[] => {
  const petrol = allPrices.petrol[cityKey] || { price: 0, change: 0 };
  const diesel = allPrices.diesel[cityKey] || { price: 0, change: 0 };

  return [
    {
      emoji: "⛽",
      name: "Petrol",
      price: petrol.price,
      change: petrol.change,
      unit: "/litre",
      category: "fuel",
    },
    {
      emoji: "⛽",
      name: "Diesel",
      price: diesel.price,
      change: diesel.change,
      unit: "/litre",
      category: "fuel",
    },
    {
      emoji: "🪙",
      name: "Gold 24K",
      price: allPrices.gold.price_24k,
      change: allPrices.gold.change_24k,
      unit: "/10g",
      category: "gold",
    },
    {
      emoji: "🪙",
      name: "Gold 22K",
      price: allPrices.gold.price_22k,
      change: allPrices.gold.change_22k,
      unit: "/10g",
      category: "gold",
    },
    {
      emoji: "🔥",
      name: "LPG",
      price: allPrices.lpg.price,
      change: allPrices.lpg.change,
      unit: "/cylinder",
      category: "gas",
    },
    {
      emoji: "🧅",
      name: "Onion",
      price: allPrices.onion.price,
      change: allPrices.onion.change,
      unit: "/kg",
      category: "veg",
    },
    {
      emoji: "🍚",
      name: "Rice",
      price: allPrices.rice.price,
      change: allPrices.rice.change,
      unit: "/kg",
      category: "staple",
    },
    {
      emoji: "🥛",
      name: "Milk",
      price: allPrices.milk.price,
      change: allPrices.milk.change,
      unit: "/litre",
      category: "dairy",
    },
  ];
};
