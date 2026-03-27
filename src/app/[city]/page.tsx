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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Setting location to {cityName}...
        </p>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        try {
          localStorage.setItem('${CITY_KEY}', '${params.city}');
          localStorage.setItem('${CITY_NAME_KEY}', '${cityName}');
          window.location.href = '/';
        } catch (e) {
          window.location.href = '/';
        }
      `,
        }}
      />
    </div>
  );
}
