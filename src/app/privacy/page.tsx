import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bhav Alert",
  description: "Privacy policy for Bhav Alert - Daily Price Tracker India",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Privacy Policy</h1>
      <p className="text-sm text-gray-500 font-medium">Last updated: March 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">What Data We Collect</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Bhav Alert stores your <strong>city preference</strong> and <strong>language preference</strong> locally on your device using browser localStorage. This data never leaves your device and is not transmitted to any server.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Personal Information</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          We do <strong>not</strong> collect any personal information. There are no user accounts, no login, no email collection, and no tracking cookies. We do not store your IP address or device information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Firebase Usage</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          We use Google Firebase Firestore solely for storing commodity price data (petrol, diesel, gold, LPG, etc.). No user data is stored in Firebase. Price data is publicly sourced and aggregated for informational purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Third-Party Services</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          We may display advertisements through Google AdSense and affiliate links to third-party services (Paytm, Blinkit, etc.). These services have their own privacy policies. We recommend reviewing them independently.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Donations</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Voluntary donations are processed through Razorpay or UPI. We do not store payment information. All payment processing is handled by the respective payment providers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Contact</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          For privacy concerns, contact us at: <strong>[CONTACT_EMAIL]</strong>
        </p>
      </section>

      <a href="/" className="inline-block mt-8 text-orange-600 font-bold text-sm hover:underline">
        ← Back to Home
      </a>
    </div>
  );
}
