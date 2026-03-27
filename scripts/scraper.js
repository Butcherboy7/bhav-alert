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
  console.log("Fetching gold prices...");

  // Primary: goldapi.io API
  if (process.env.GOLD_API_KEY) {
    try {
      const res = await axios.get("https://www.goldapi.io/api/XAU/INR", {
        headers: { "x-access-token": process.env.GOLD_API_KEY },
        timeout: TIMEOUT,
      });
      const pricePerOunce = res.data.price;
      const price24kPer10g = Math.round((pricePerOunce / 31.1035) * 10 / 10) * 10;
      const price22kPer10g = Math.round((price24kPer10g * 0.916) / 10) * 10;

      console.log(`Gold API: 24K=₹${price24kPer10g}, 22K=₹${price22kPer10g}`);
      return {
        price_24k: price24kPer10g,
        price_22k: price22kPer10g,
        change_24k: 0,
        change_22k: 0,
      };
    } catch (err) {
      console.error("Gold API failed, falling back to scraper:", err.message);
    }
  }

  // Fallback: Goodreturns scraping
  try {
    const res = await axios.get("https://www.goodreturns.in/gold-rates/", {
      headers: { "User-Agent": USER_AGENT },
      timeout: TIMEOUT,
    });
    const $ = cheerio.load(res.data);

    // Try multiple selectors for resilience
    let gold24k = 0;
    let gold22k = 0;

    // Selector approach 1: data attributes
    $("[data-carat='24']").each((_, el) => {
      const val = parseFloat($(el).text().replace(/[^\d.]/g, ""));
      if (val > 50000) gold24k = val;
    });
    $("[data-carat='22']").each((_, el) => {
      const val = parseFloat($(el).text().replace(/[^\d.]/g, ""));
      if (val > 50000) gold22k = val;
    });

    // Selector approach 2: table search
    if (!gold24k) {
      $("td").each((_, el) => {
        const text = $(el).text().trim();
        if (text.includes("24") && text.toLowerCase().includes("carat")) {
          const priceCell = $(el).next();
          const val = parseFloat(priceCell.text().replace(/[^\d.]/g, ""));
          if (val > 50000) gold24k = val;
        }
        if (text.includes("22") && text.toLowerCase().includes("carat")) {
          const priceCell = $(el).next();
          const val = parseFloat(priceCell.text().replace(/[^\d.]/g, ""));
          if (val > 50000) gold22k = val;
        }
      });
    }

    // Selector approach 3: common class patterns
    if (!gold24k) {
      const priceTexts = [];
      $("span, td, div").each((_, el) => {
        const text = $(el).text().replace(/[^\d]/g, "");
        const val = parseInt(text);
        if (val > 100000 && val < 200000) priceTexts.push(val);
      });
      if (priceTexts.length >= 2) {
        gold24k = Math.max(...priceTexts.slice(0, 4));
        gold22k = Math.min(...priceTexts.slice(0, 4));
      }
    }

    return {
      price_24k: gold24k || 144710,
      price_22k: gold22k || 132650,
      change_24k: 0,
      change_22k: 0,
    };
  } catch (err) {
    console.error("Gold scrape failed:", err.message);
    return { price_24k: 144710, price_22k: 132650, change_24k: 0, change_22k: 0 };
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
    const res = await axios.get(
      `https://api.data.gov.in/resource/9ef2781d-7a8c-4dc9-b1d1-3ff391b93f77?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[state]=Maharashtra&filters[district]=Mumbai`,
      { timeout: TIMEOUT }
    );
    const onionWholesale = res.data.records[0]?.modal_price || 3000;
    const onionRetail = (onionWholesale / 100) * 1.3;

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

  if (prev.gold) {
    todayData.gold.change_24k = todayData.gold.price_24k - prev.gold.price_24k;
    todayData.gold.change_22k = todayData.gold.price_22k - prev.gold.price_22k;
  }

  ["lpg", "onion", "rice", "milk"].forEach((cat) => {
    if (prev[cat]) {
      todayData[cat].change = Math.round((todayData[cat].price - prev[cat].price) * 100) / 100;
    }
  });

  return todayData;
}

async function computeWeekTrends(todayData) {
  console.log("Computing 7-day trends...");
  const trends = {};
  const days = [];

  for (let i = 1; i <= 7; i++) {
    const dateStr = getISTDate(i);
    const doc = await db.collection("prices").doc(dateStr).get();
    if (doc.exists) days.push(doc.data());
  }

  if (days.length === 0) {
    return { petrol: "stable", diesel: "stable", gold24k: "stable", gold22k: "stable", lpg: "stable", onion: "stable", rice: "stable", milk: "stable" };
  }

  const oldest = days[days.length - 1];

  // Petrol trend (mumbai as representative)
  const commodities = [
    { key: "petrol", getValue: (d) => d.petrol?.mumbai?.price },
    { key: "diesel", getValue: (d) => d.diesel?.mumbai?.price },
    { key: "gold24k", getValue: (d) => d.gold?.price_24k },
    { key: "gold22k", getValue: (d) => d.gold?.price_22k },
    { key: "lpg", getValue: (d) => d.lpg?.price },
    { key: "onion", getValue: (d) => d.onion?.price },
    { key: "rice", getValue: (d) => d.rice?.price },
    { key: "milk", getValue: (d) => d.milk?.price },
  ];

  for (const { key, getValue } of commodities) {
    const todayVal = getValue(todayData);
    const oldVal = getValue(oldest);
    if (todayVal && oldVal && oldVal > 0) {
      const pctChange = ((todayVal - oldVal) / oldVal) * 100;
      const rounded = Math.round(pctChange * 10) / 10;
      if (rounded > 0.1) {
        trends[key] = { direction: "up", percent: rounded };
      } else if (rounded < -0.1) {
        trends[key] = { direction: "down", percent: Math.abs(rounded) };
      } else {
        trends[key] = { direction: "stable", percent: 0 };
      }
    } else {
      trends[key] = { direction: "stable", percent: 0 };
    }
  }

  return trends;
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
  todayData.trends = await computeWeekTrends(todayData);

  const todayStr = getISTDate();
  await db.collection("prices").doc(todayStr).set(todayData);
  await db.collection("prices").doc("latest").set(todayData);

  console.log(`Prices updated for ${todayStr}`);
  process.exit(0);
}

main();
