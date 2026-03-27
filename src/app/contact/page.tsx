import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Bhav Alert",
  description: "Contact the Bhav Alert team",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Contact Us</h1>
      <p className="text-sm text-gray-500 font-medium">We are here to help</p>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">📧</span>
          <div>
            <h2 className="font-bold text-gray-800">Email</h2>
            <p className="text-sm text-gray-600">[CONTACT_EMAIL]</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          We typically respond within <strong>48 hours</strong>. Please include details about your query and the city/commodity you have questions about.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Common Queries</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start space-x-2">
            <span>📊</span>
            <span><strong>Wrong price?</strong> Prices are scraped from public sources and may have a slight delay. Refresh to get the latest.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>🐛</span>
            <span><strong>Bug report?</strong> Describe what you saw vs what you expected. Include your city and device type.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>💡</span>
            <span><strong>Feature request?</strong> We love hearing ideas. Tell us what would make Bhav Alert better for you.</span>
          </li>
        </ul>
      </section>

      <a href="/" className="inline-block mt-8 text-orange-600 font-bold text-sm hover:underline">
        ← Back to Home
      </a>
    </div>
  );
}
