"use client";

import React from "react";

interface RazorpayButtonProps {
  amount: number;
  emoji: string;
  label: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ amount, emoji, label }) => {
  const envMap: Record<number, string | undefined> = {
    29: process.env.NEXT_PUBLIC_RAZORPAY_LINK_29,
    49: process.env.NEXT_PUBLIC_RAZORPAY_LINK_49,
    99: process.env.NEXT_PUBLIC_RAZORPAY_LINK_99,
  };

  const razorpayLink = envMap[amount];
  const upiLink = `upi://pay?pa=YOUR_UPI_ID@upi&pn=BhavAlert&am=${amount}&cu=INR`;
  const href = razorpayLink || upiLink;

  return (
    <a
      href={href}
      target={razorpayLink ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-xl flex flex-col items-center transition-all group active:scale-90"
    >
      <span className="text-lg mb-0.5">{emoji}</span>
      <span className="text-[10px] opacity-70 mb-0.5">Pay</span>
      <span className="text-lg font-black">₹{amount}</span>
    </a>
  );
};

export default RazorpayButton;
