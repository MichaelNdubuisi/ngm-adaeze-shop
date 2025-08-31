import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

const PaystackButton = ({ email, amount, onPaymentInit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    if (onPaymentInit) onPaymentInit();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/payments/paystack`,
        { email, amount }, // Ensure amount is in KOBO
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      if (res.data?.data?.authorization_url) {
        window.location.href = res.data.data.authorization_url;
      } else {
        throw new Error("Authorization URL not received from server.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment initialization failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="btn-primary w-full max-w-xs mx-auto flex items-center justify-center space-x-2 py-4 px-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>💳</span>
          <span>Pay ₦{(amount / 100).toFixed(2)} with Paystack</span>
        </>
      )}
    </button>
  );
};

export default PaystackButton;
