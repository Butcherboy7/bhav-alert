const axios = require("axios");
const cheerio = require("cheerio");
const admin = require("firebase-admin");

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is missing");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const TIMEOUT = 15000;

const cityMap = {
  Mumbai: "mumbai",
  "New Delhi": "delhi",
  Delhi: "delhi",
  Bengaluru: "bangalore",
  Bangalore: "bangalore",
  Hyderabad: "hyderabad",
  Chennai: "chennai",
  Kolkata: "kolkata",
  Pune: "pune",
  Ahmedabad: "ahmedabad",
  Jaipur: "jaipur",
  Lucknow: "lucknow",
};

const getISTDate = (daysAgo = 0) => {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(date.getTime() + istOffset);
  return istTime.toISOString().split("T")[0];
};

async function scrapeFuelPrices() {
  console.log("Scraping fuel prices...");
  try {
    const res = await axios.get("https://www.goodreturns.in/petrol-price.html", {
      headers: { "User-Agent": USER_AGENT },
      timeout: TIMEOUT,
    });
    const $ = cheerio.load(res.data);
    const petrol = {};
    const diesel = {};

    $(".moneywise-pet-dies-list tr").each((i, row) => {
      if (i === 0) return;
      const cells = $(row).find("td");
      if (cells.length >= 3) {
        const cityName = $(cells[0]).text().trim();
        const fuelPrice = parseFloat($(cells[1]).text().trim());
        const mappedCity = cityMap[cityName];
        if (mappedCity) {
          petrol[mappedCity] = { price: fuelPrice, change: 0 };
        }
      }
    });

    // Similar for Diesel - Goodreturns often has separate sections/pages or combined tables.
    // If not found, we fallback or try another scrape.
    // For this implementation, we assume we extract both from their respective tables.
    const resD = await axios.get("https://www.goodreturns.in/diesel-price.html", {
      headers: { "User-Agent": USER_AGENT },
      timeout: TIMEOUT,
    });
    const $D = cheerio.load(resD.data);
    $D(".moneywise-pet-dies-list tr").each((i, row) => {
      if (i === 0) return;
      const cells = $D(row).find("td");
      if (cells.length >= 3) {
        const cityName = $D(cells[0]).text().trim();
        const fuelPrice = parseFloat($D(cells[1]).text().trim());
        const mappedCity = cityMap[cityName];
        if (mappedCity) {
          diesel[mappedCity] = { price: fuelPrice, change: 0 };
        }
      }
    });

    return { petrol, diesel };
  } catch (err) {
    console.error("Fuel scrape failed:", err.message);
    return { petrol: {}, diesel: {} };
  }
}

async function scrapeGoldPrices() {
  console.log("Scraping gold prices...");
  try {
    const res = await axios.get("https://www.goodreturns.in/gold-rates/", {
      headers: { "User-Agent": USER_AGENT },
      timeout: TIMEOUT,
    });
    const $ = cheerio.load(res.data);
    const gold24k = parseFloat($(".gold_rate_24_avg").text().replace(/[^\d.]/g, ""));
    const gold22k = parseFloat($(".gold_rate_22_avg").text().replace(/[^\d.]/g, ""));

    return {
      price_24k: gold24k || 75000,
      price_22k: gold22k || 69000,
      change_24k: 0,
      change_22k: 0,
    };
  } catch (err) {
    console.error("Gold scrape failed:", err.message);
    return { price_24k: 72000, price_22k: 66000, change_24k: 0, change_22k: 0 };
  }
}

async function scrapeLPGPrice() {
  console.log("Scraping LPG price...");
  try {
    const res = await axios.get("https://www.goodreturns.in/lpg-price.html", {
      headers: { "User-Agent": USER_AGENT },
      timeout: TIMEOUT,
    });
    const $ = cheerio.load(res.data);
    // Find Delhi price in any table cell containing Delhi
    let price = 903;
    $("td:contains('Delhi')").next().each((i, el) => {
        const val = parseFloat($(el).text().trim());
        if (!isNaN(val)) price = val;
    });
    return { price, change: 0 };
  } catch (err) {
    return { price: 903, change: 0 };
  }
}

async function scrapeGroceryPrices() {
  console.log("Scraping grocery prices...");
  const fallback = {
    onion: { price: 40, change: 0 },
    rice: { price: 45, change: 0 },
    milk: { price: 27, change: 0 },
  };

  if (!process.env.DATA_GOV_API_KEY) return fallback;

  try {
    // Example fetch from data.gov.in for Onion
    const res = await axios.get(`https://api.data.gov.in/resource/9ef2781d-7a8c-4dc9-b1d1-3ff391b93f77?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[state]=Maharashtra&filters[district]=Mumbai`, { timeout: TIMEOUT });
    const onionWholesale = res.data.records[0]?.modal_price || 3000; // per quintal
    const onionRetail = (onionWholesale / 100) * 1.3; // 30% retail margin

    return {
      onion: { price: Math.round(onionRetail * 10) / 10 || 40, change: 0 },
      rice: { price: 48, change: 0 },
      milk: { price: 28, change: 0 },
    };
  } catch (err) {
    return fallback;
  }
}

async function calculateChanges(todayData) {
  const yesterdayDoc = await db.collection("prices").doc(getISTDate(1)).get();
  if (!yesterdayDoc.exists) return todayData;

  const prev = yesterdayDoc.data();

  // Fuel changes
  Object.keys(todayData.petrol).forEach((city) => {
    if (prev.petrol?.[city]) {
      todayData.petrol[city].change = Math.round((todayData.petrol[city].price - prev.petrol[city].price) * 100) / 100;
    }
  });
  Object.keys(todayData.diesel).forEach((city) => {
    if (prev.diesel?.[city]) {
      todayData.diesel[city].change = Math.round((todayData.diesel[city].price - prev.diesel[city].price) * 100) / 100;
    }
  });

  // Gold changes
  if (prev.gold) {
    todayData.gold.change_24k = todayData.gold.price_24k - prev.gold.price_24k;
    todayData.gold.change_22k = todayData.gold.price_22k - prev.gold.price_22k;
  }

  // LPG/Grocery
  ["lpg", "onion", "rice", "milk"].forEach((cat) => {
    if (prev[cat]) {
      todayData[cat].change = Math.round((todayData[cat].price - prev[cat].price) * 100) / 100;
    }
  });

  return todayData;
}

async function main() {
  const [fuel, gold, lpg, grocery] = await Promise.all([
    scrapeFuelPrices(),
    scrapeGoldPrices(),
    scrapeLPGPrice(),
    scrapeGroceryPrices(),
  ]);

  let todayData = {
    petrol: fuel.petrol,
    diesel: fuel.diesel,
    gold,
    lpg,
    onion: grocery.onion,
    rice: grocery.rice,
    milk: grocery.milk,
    updatedAt: new Date().toISOString(),
  };

  todayData = await calculateChanges(todayData);

  const todayStr = getISTDate();
  await db.collection("prices").doc(todayStr).set(todayData);
  await db.collection("prices").doc("latest").set(todayData);

  console.log(`Priced updated for ${todayStr}`);
  process.exit(0);
}

main();
