// src/api.js

// Base URL for API requests
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ngm-adaeze-shop.onrender.com"
    : "http://localhost:5000";

export default API_BASE_URL;
