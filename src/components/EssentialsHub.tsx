import React from "react";

interface EssentialItem {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  asinEnv: string;
  defaultAsin: string;
}

const essentials: EssentialItem[] = [
  { id: "stove", emoji: "🔥", name: "LPG Stove", desc: "Energy efficient models", asinEnv: "AMAZON_ASIN_STOVE", defaultAsin: "B0086383Y2" },
  { id: "grocery", emoji: "🌾", name: "Pantry Bulk", desc: "Rice, Dal & Wheat", asinEnv: "AMAZON_ASIN_GROCERY", defaultAsin: "B0757H7X9W" },
  { id: "hygiene", emoji: "🧼", name: "Hygiene Kit", desc: "Handwash & Soaps", asinEnv: "AMAZON_ASIN_HYGIENE", defaultAsin: "B084GZ9P72" },
  { id: "light", emoji: "🔦", name: "Torch/Lights", desc: "For emergencies", asinEnv: "AMAZON_ASIN_TORCH", defaultAsin: "B07P7S6QDX" },
  { id: "health", emoji: "😷", name: "Health Kit", desc: "Masks & Sanitizers", asinEnv: "AMAZON_ASIN_MASK", defaultAsin: "B089274NV2" },
  { id: "power", emoji: "🔋", name: "Power Bank", desc: "Device backup", asinEnv: "AMAZON_ASIN_POWER", defaultAsin: "B08HVL8QN3" },
];

export const EssentialsHub: React.FC = () => {
  const affiliateTag = "bhavalert-21";

  const getUrl = (item: EssentialItem) => {
    // Try to get custom ASIN from process.env, fallback to default
    const asin = process.env[`NEXT_PUBLIC_${item.asinEnv}`] || item.defaultAsin;
    return `https://www.amazon.in/dp/${asin}?tag=${affiliateTag}`;
  };

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Lockdown Essentials</h2>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Recommended for You</p>
        </div>
        <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-orange-200">
          Best Deals
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {essentials.map((item) => (
          <a
            key={item.id}
            href={getUrl(item)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm active:scale-95 transition-all hover:bg-gray-50 group"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-xl mb-3 group-hover:bg-orange-50 transition-colors">
              {item.emoji}
            </div>
            <h3 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h3>
            <p className="text-[10px] text-gray-500 mt-1 leading-snug">{item.desc}</p>
            <div className="mt-3 flex items-center text-[10px] font-black text-orange-500 uppercase tracking-tighter">
              View Shop <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-3xl flex items-start space-x-3">
        <span className="text-xl">ℹ️</span>
        <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
          Note: These are curated essential products based on your current commodity prices. 
          Prices are subject to change on Amazon.
        </p>
      </div>
    </div>
  );
};
