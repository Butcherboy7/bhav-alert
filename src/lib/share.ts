import { DayPrices } from "@/types";
import { CITIES } from "@/lib/cities";
import { APP_URL } from "@/lib/constants";

const formatChange = (change: number): string => {
  if (change > 0) return ` (↑₹${change}) 🔴`;
  if (change < 0) return ` (↓₹${Math.abs(change)}) 🟢`;
  return "";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

export const generateShareMessage = (
  prices: DayPrices,
  cityName: string
): string => {
  const city = CITIES.find((c) => c.name === cityName);
  const cityKey = city?.key || "mumbai"; // Fallback to mumbai

  const petrol = prices.petrol[cityKey] || { price: 0, change: 0 };
  const diesel = prices.diesel[cityKey] || { price: 0, change: 0 };

  const gold24k = prices.gold.price_24k.toLocaleString("en-IN");
  const gold22k = prices.gold.price_22k.toLocaleString("en-IN");

  const dateStr = formatDate(prices.updatedAt);

  return `━━━━━━━━━━━━━━━━
📊 *आज का भाव* | ${dateStr}
📍 *${cityName}*
━━━━━━━━━━━━━━━━
⛽ Petrol: ₹${petrol.price}${formatChange(petrol.change)}
⛽ Diesel: ₹${diesel.price}${formatChange(diesel.change)}
🪙 Gold 24K: ₹${gold24k}/10g${formatChange(prices.gold.change_24k)}
🪙 Gold 22K: ₹${gold22k}/10g${formatChange(prices.gold.change_22k)}
🔥 LPG: ₹${prices.lpg.price}/cylinder${formatChange(prices.lpg.change)}
🧅 Onion: ₹${prices.onion.price}/kg${formatChange(prices.onion.change)}
🍚 Rice: ₹${prices.rice.price}/kg${formatChange(prices.rice.change)}
━━━━━━━━━━━━━━━━
📲 Daily free alerts: ${APP_URL}
━━━━━━━━━━━━━━━━`;
};

export const shareToWhatsApp = (message: string): void => {
  const encoded = encodeURIComponent(message);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
};

export const shareNative = async (message: string): Promise<void> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Bhav Alert",
        text: message,
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        shareToWhatsApp(message);
      }
    }
  } else {
    shareToWhatsApp(message);
  }
};
