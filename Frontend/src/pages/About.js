import React from 'react';
import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | NGM & Luxury Shop</title>
        <meta name="description" content="Learn about NGM & Luxury Shop, your premier destination for exclusive luxury products. Discover our story, mission, and commitment to quality." />
        <meta name="keywords" content="about NGM luxury store, luxury shop story, premium products, e-commerce Nigeria" />
        <meta property="og:title" content="About Us | NGM & Luxury Shop" />
        <meta property="og:description" content="Learn about NGM & Luxury Shop, your premier destination for exclusive luxury products." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ngm-adaeze-shop.vercel.app/about" />
        <meta property="og:image" content="https://ngm-adaeze-shop.vercel.app/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">About NGM & Luxury Shop</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Welcome to NGM & Luxury Shop, your premier destination for exclusive luxury products.
              We are dedicated to bringing you the finest selection of premium items that combine elegance,
              quality, and affordability. Our curated collection features everything from fashion accessories
              to electronics, ensuring you find exactly what you're looking for.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At NGM & Luxury Shop, our mission is to make luxury accessible to everyone. We believe that
              everyone deserves to experience the joy of owning high-quality, beautiful products without
              breaking the bank. We're committed to providing exceptional customer service and ensuring
              your shopping experience is seamless and enjoyable.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Why Choose Us?</h2>
            <ul className="text-gray-600 mb-6 list-disc list-inside space-y-2">
              <li>Curated selection of premium luxury products</li>
              <li>Competitive pricing on high-quality items</li>
              <li>Secure and fast shipping</li>
              <li>Excellent customer support</li>
              <li>User-friendly online shopping experience</li>
              <li>Regular updates with new arrivals</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Have questions or need assistance? We're here to help! Reach out to our customer service team
              for any inquiries about our products, orders, or services. Your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
