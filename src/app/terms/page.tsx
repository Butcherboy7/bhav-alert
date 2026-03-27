import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Bhav Alert",
  description: "Terms of service for Bhav Alert - Daily Price Tracker India",
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Terms of Service</h1>
      <p className="text-sm text-gray-500 font-medium">Last updated: March 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Price Data Accuracy</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          All price data displayed on Bhav Alert is sourced from publicly available sources and aggregated automatically. While we strive for accuracy, prices may not be 100% accurate due to timing differences, regional variations, and dealer margins. Always verify with actual vendors before making purchase decisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Not Financial Advice</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          The information provided by Bhav Alert is for <strong>informational purposes only</strong> and does not constitute financial, investment, or trading advice. Gold price trends and commodity price changes should not be used as the sole basis for any financial decisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Usage Agreement</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          By using Bhav Alert, you agree to these terms. You acknowledge that prices are approximate and may vary. You agree not to use the data for commercial purposes without prior permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Changes</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          We reserve the right to modify these terms, update features, or discontinue the service at any time without prior notice.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Contact</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Questions about these terms? Contact us at: <strong>acexuzair@gmail.com</strong>
        </p>
      </section>

      <a href="/" className="inline-block mt-8 text-orange-600 font-bold text-sm hover:underline">
        ← Back to Home
      </a>
    </div>
  );
}
