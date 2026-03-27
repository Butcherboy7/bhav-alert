import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Bhav Alert",
  description: "Refund policy for Bhav Alert donations",
};

export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Refund Policy</h1>
      <p className="text-sm text-gray-500 font-medium">Last updated: March 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Voluntary Donations</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          All payments made through Bhav Alert are <strong>voluntary donations</strong> to support the development and maintenance of this free service. These donations are non-refundable as they are not a purchase of goods or services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">No Subscription</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Bhav Alert does not offer any subscription or paid product. The app is completely free to use. Donations are one-time voluntary contributions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Disputes</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          If you believe a payment was made in error or without your authorization, please contact us at <strong>acexuzair@gmail.com</strong> within 7 days. We will review each case individually and respond within 48 hours.
        </p>
      </section>

      <a href="/" className="inline-block mt-8 text-orange-600 font-bold text-sm hover:underline">
        ← Back to Home
      </a>
    </div>
  );
}
