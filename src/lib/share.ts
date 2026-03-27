import { DayPrices } from "@/types";
import { CITIES } from "@/lib/cities";
import { APP_URL } from "@/lib/constants";
import { TranslationStrings } from "@/lib/translations";

const formatChange = (change: number): string => {
  if (change > 0) return ` (↑₹${change}) 🔴`;
  if (change < 0) return ` (↓₹${Math.abs(change)}) 🟢`;
  return "";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

const TIPS = [
  "💡 Petrol prices change daily at 6 AM",
  "💡 Buy gold on dips!",
  "💡 LPG price changes on 1st of month",
  "💡 Onion prices spike Oct-Dec",
  "💡 Share this with your family group!",
];

const getRandomTip = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TIPS[dayOfYear % TIPS.length];
};

export const generateShareMessage = (
  prices: DayPrices,
  cityName: string,
  t: (key: keyof TranslationStrings) => string
): string => {
  const city = CITIES.find((c) => c.name === cityName);
  const cityKey = city?.key || "mumbai";

  const petrol = prices.petrol[cityKey] || { price: 0, change: 0 };
  const diesel = prices.diesel[cityKey] || { price: 0, change: 0 };

  const gold24k = prices.gold.price_24k.toLocaleString("en-IN");
  const gold22k = prices.gold.price_22k.toLocaleString("en-IN");

  const dateStr = formatDate(prices.updatedAt);

  return `━━━━━━━━━━━━━━━━
📊 *${t("todaysBhav")}* | ${dateStr}
📍 *${cityName}*
━━━━━━━━━━━━━━━━
⛽ ${t("petrol")}: ₹${petrol.price}${formatChange(petrol.change)}
⛽ ${t("diesel")}: ₹${diesel.price}${formatChange(diesel.change)}
🪙 ${t("gold24k")}: ₹${gold24k}/10g${formatChange(prices.gold.change_24k)}
🪙 ${t("gold22k")}: ₹${gold22k}/10g${formatChange(prices.gold.change_22k)}
🔥 ${t("lpg")}: ₹${prices.lpg.price}/cylinder${formatChange(prices.lpg.change)}
🧅 ${t("onion")}: ₹${prices.onion.price}/kg${formatChange(prices.onion.change)}
🍚 ${t("rice")}: ₹${prices.rice.price}/kg${formatChange(prices.rice.change)}
🥛 ${t("milk")}: ₹${prices.milk.price}/L${formatChange(prices.milk.change)}
━━━━━━━━━━━━━━━━
📲 Daily free alerts: ${APP_URL}
${getRandomTip()}
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
