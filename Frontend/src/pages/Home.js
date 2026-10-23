
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import bg1 from "../assets/images/bg1.jpg";
import ProductList from "../components/ProductList";
import API_BASE_URL from "../api";
import { useCart } from "../contexts/CartContext";

export const categories = [
  "clothes",
  "shoes",
  "shorts",
  "electronics",
  "other",
];

const categoryCards = [
  {
    name: "Clothing",
    value: "clothes",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=500&fit=crop",
    description: "Elevate your everyday style",
  },
  {
    name: "Shoes",
    value: "shoes",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    description: "Step out in confidence",
  },
  {
    name: "Phones",
    value: "electronics",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    description: "Technology meets style",
  },
  {
    name: "Electronics",
    value: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop",
    description: "Discover modern essentials",
  },
  {
    name: "Accessories",
    value: "other",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
    description: "The finishing touches",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const { dispatch } = useCart();

  const fetchProducts = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        signal,
      });

      if (!response.ok) {
        throw new Error("Unable to fetch products.");
      }

      const data = await response.json();
      let fetchedProducts = [];

      if (data.success && Array.isArray(data.data?.products)) {
        fetchedProducts = data.data.products;
      } else if (Array.isArray(data)) {
        fetchedProducts = data;
      } else if (Array.isArray(data.products)) {
        fetchedProducts = data.products;
      } else if (Array.isArray(data.data)) {
        fetchedProducts = data.data;
      }

      setProducts(fetchedProducts);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(
          "We're having trouble loading our products. Please try again."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal);

    return () => controller.abort();
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", product });
  };

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sortBy) {
      case "price-low":
        return result.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0)
        );

      case "price-high":
        return result.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0)
        );

      case "newest":
      default:
        return result.sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at || 0).getTime() -
            new Date(a.createdAt || a.created_at || 0).getTime()
        );
    }
  }, [products, sortBy]);

  const featuredProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.created_at || 0).getTime() -
          new Date(a.createdAt || a.created_at || 0).getTime()
      )
      .slice(0, 3);
  }, [products]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    // No newsletter backend is connected yet.
    setNewsletterMessage(
      "Thanks for your interest! Newsletter sign-up is not available yet."
    );
    setNewsletterEmail("");
  };

  const ProductSkeletons = ({ count = 3 }) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="skeleton mb-4 h-56 rounded-xl" />
          <div className="skeleton mb-3 h-5 rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
      ))}
    </div>
  );

  const ProductError = () => (
    <div className="rounded-2xl border border-red-100 bg-white px-5 py-12 text-center">
      <span className="text-3xl" aria-hidden="true">
        😕
      </span>
      <p className="mt-4 text-sm leading-6 text-red-600 sm:text-base">
        {error}
      </p>
      <button
        type="button"
        onClick={() => fetchProducts()}
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        Try Again ↻
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>NGM &amp; Luxury | Premium E-commerce Store</title>
        <meta
          name="description"
          content="Shop stylish clothing, shoes, accessories and electronics at NGM & Luxury. Discover products carefully selected for your lifestyle."
        />
        <meta
          name="keywords"
          content="NGM and Luxury, online shopping, clothing, shoes, accessories, electronics, luxury products"
        />
        <meta
          property="og:title"
          content="NGM & Luxury | Premium E-commerce Store"
        />
        <meta
          property="og:description"
          content="Discover extraordinary finds and carefully curated collections at NGM & Luxury."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ngm-adaeze-shop.vercel.app/"
        />
        <meta
          property="og:image"
          content="https://ngm-adaeze-shop.vercel.app/Logo.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="min-h-screen overflow-hidden bg-[#faf9f6] text-slate-900">
        {/* HERO BANNER */}
        <section
          id="home"
          className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-[#07162e] sm:min-h-[500px] lg:min-h-[580px]"
        >
          <img
            src={bg1}
            alt="NGM & Luxury shopping collection"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06142b]/95 via-[#06142b]/75 to-[#06142b]/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06142b]/35 via-transparent to-black/10" />

          <div className="absolute left-0 top-0 h-1 w-36 bg-gradient-to-r from-[#b88732] to-transparent" />

          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
            <div className="max-w-2xl text-left">
              <h1 className="font-playfair text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to
                <span className="mt-1 block bg-gradient-to-r from-[#f8e6bb] via-[#d9ad5b] to-[#fff0cf] bg-clip-text text-transparent">
                  NGM &amp; Luxury!
                  <span className="ml-3 inline-block align-middle text-3xl sm:text-4xl">
                    👋
                  </span>
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
                Discover extraordinary finds, thoughtfully curated for you.
              </p>

              <div className="mt-8">
                <Link
                  to="/products"
                  className="group inline-flex min-h-[58px] items-center justify-center gap-4 rounded-full bg-gradient-to-r from-[#fff4dc] to-[#f4dfb5] px-8 py-4 text-base font-bold text-[#10213b] shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#e6c47a]/40 sm:min-h-[66px] sm:px-10 sm:text-lg"
                >
                  <span>Start Shopping</span>
                  <span
                    aria-hidden="true"
                    className="text-xl transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4af6a]/80 to-transparent" />
        </section>

        {/* SHOP BY CATEGORY */}
        <section
          id="categories"
          className="bg-gradient-to-b from-white to-[#faf9f6] py-16 sm:py-20 lg:py-24"
        >
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:mb-16">
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#b88732]">
                Find Your Favorites
              </span>

              <h2 className="font-playfair text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Shop by Category
              </h2>

              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#b88732] to-[#f0d89a]" />

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                Explore thoughtfully selected collections that bring style,
                convenience and personality to your everyday life.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:gap-7">
              {categoryCards.map((category) => (
                <Link
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(category.value)}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-[#d4af6a]/50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#d4af6a]/30"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#06142b]/90 via-[#06142b]/10 to-transparent opacity-90 transition duration-300 group-hover:opacity-100" />

                    <div className="absolute left-3 top-3 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-[#e6c47a] opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <h3 className="font-playfair text-lg font-bold text-white sm:text-xl">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-gray-200 sm:text-sm">
                        {category.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#f0d89a] sm:text-sm">
                        Explore
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="bg-[#f5f4f0] py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#b88732]">
                  Handpicked For You
                </span>
                <h2 className="mt-3 font-playfair text-3xl font-bold text-slate-900 sm:text-4xl">
                  Featured Products
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Explore some of the latest additions to our collection.
                </p>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-700 transition hover:text-[#b88732] sm:self-auto"
              >
                View All Products <span>→</span>
              </Link>
            </div>

            {loading ? (
              <ProductSkeletons count={3} />
            ) : error ? (
              <ProductError />
            ) : featuredProducts.length > 0 ? (
              <ProductList
                products={featuredProducts}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center">
                <p className="text-slate-600">
                  No featured products are available right now.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ALL PRODUCTS */}
        <section id="products" className="bg-white py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#b88732]">
                  The Collection
                </span>
                <h2 className="mt-3 font-playfair text-3xl font-bold text-slate-900 sm:text-4xl">
                  All Products
                </h2>

                {!loading && !error && (
                  <p className="mt-2 text-sm text-slate-500">
                    {products.length}{" "}
                    {products.length === 1 ? "product" : "products"} available
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="product-sort"
                  className="whitespace-nowrap text-sm text-slate-500"
                >
                  Sort by:
                </label>

                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full max-w-[210px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <ProductSkeletons count={4} />
            ) : error ? (
              <ProductError />
            ) : sortedProducts.length > 0 ? (
              <ProductList
                products={sortedProducts}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-[#faf9f6] px-5 py-16 text-center">
                <span className="text-4xl" aria-hidden="true">
                  🛍️
                </span>
                <h3 className="mt-4 font-playfair text-xl font-bold text-slate-800">
                  Your next favorite find is coming soon
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Check back soon for new arrivals at NGM &amp; Luxury.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="relative isolate overflow-hidden bg-[#07162e] py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0b2042] via-[#07162e] to-[#14294a]" />
          <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#d4af6a]/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="container-custom mx-auto px-4 text-center sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e6c47a]">
              Stay In The Know
            </span>

            <h2 className="mx-auto mt-4 max-w-3xl font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              A Little More Luxury,
              <span className="block text-[#e6c47a]">Straight to You.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover new arrivals, exclusive offers and fresh inspiration
              from the world of NGM &amp; Luxury.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setNewsletterMessage("");
                }}
                placeholder="Enter your email address"
                required
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-[#e6c47a] focus:ring-4 focus:ring-[#e6c47a]/10"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#fff2d2] to-[#e6c47a] px-7 py-4 text-sm font-bold text-[#10213b] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e6c47a]/10"
              >
                Join Our Family <span>→</span>
              </button>
            </form>

            {newsletterMessage && (
              <p
                role="status"
                className="mx-auto mt-4 max-w-xl text-sm text-[#f0d89a]"
              >
                {newsletterMessage}
              </p>
            )}

            <p className="mt-4 text-xs text-slate-400">
              A more stylish inbox starts here.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
