import { CITIES } from "@/lib/cities";
import { CITY_KEY, CITY_NAME_KEY } from "@/lib/constants";
import { Metadata } from "next";

export async function generateStaticParams() {
  return CITIES.map((city) => ({
    city: city.key,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const city = CITIES.find((c) => c.key === params.city);
  const cityName = city?.name || "Mumbai";

  return {
    title: `Petrol Price Today in ${cityName} | Gold Rate ${cityName} | Bhav Alert`,
    description: `Check today's petrol, diesel, gold (24K/22K), and LPG prices in ${cityName}, ${city?.state}. Get live daily updates and alerts.`,
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = CITIES.find((c) => c.key === params.city);
  const cityName = city?.name || "Mumbai";
  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12">
      <div className="max-w-md w-full mx-auto px-6 space-y-8 flex-1">
        
        {/* SEO Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-800 leading-tight">
            Petrol Price Today in <span className="text-orange-600">{cityName}</span>
          </h1>
          <p className="text-sm font-bold text-gray-500">{todayStr}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-black text-gray-800">
            📊 Today&apos;s Market Rates for {cityName}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Get real-time updates for fuel (Petrol/Diesel), Gold (24K/22K), domestic LPG, and essential commodities like Onion, Rice, and Milk for {cityName}, {city?.state}.
          </p>
          
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2"><span>✅</span> <span>Live tracking updated daily</span></li>
            <li className="flex items-center space-x-2"><span>✅</span> <span>Changes compared to yesterday</span></li>
            <li className="flex items-center space-x-2"><span>✅</span> <span>7-day price trends</span></li>
            <li className="flex items-center space-x-2"><span>✅</span> <span>Custom price drop alerts</span></li>
          </ul>

          <a 
            href="/"
            className="block mt-6 bg-orange-500 text-white text-center py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            View live prices →
          </a>
        </div>
      </div>
    </div>
  );
}
