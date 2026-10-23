import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Logo from "../assets/images/Logo.png";

const Navbar = () => {
  const { cart } = useCart();
  const cartCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const profileRef = React.useRef(null);
  const navigate = useNavigate();

  // Existing authentication integration preserved
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userName =
    localStorage.getItem("userName") || "Valued Customer";

  // Extract the last name, handling extra spaces
  const lastName =
    userName.trim().split(/\s+/).filter(Boolean).pop() ||
    "Customer";

  // Close the profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const closeMenus = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  // Existing logout behavior and redirects preserved
  const handleLogout = () => {
    localStorage.clear();
    closeMenus();
    navigate(isAdmin ? "/admin-login" : "/login");
  };

  // Existing product search integration preserved
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(searchTerm.trim())}`
      );
      setSearchTerm("");
      closeMenus();
    }
  };

  const SearchForm = ({ mobile = false }) => (
    <form
      onSubmit={handleSearch}
      className={`flex w-full items-center rounded-2xl border border-gray-200 bg-gray-50 px-2 py-1.5 transition-all duration-300 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 ${
        mobile ? "" : "shadow-sm"
      }`}
    >
      <svg
        className="ml-2 h-5 w-5 shrink-0 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="11"
          cy="11"
          r="7"
          strokeWidth="1.8"
        />
        <path
          d="m16 16 4 4"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />

      <button
        type="submit"
        className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 active:scale-95"
      >
        Search
        <span className="ml-1" aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );

  const linkClass =
    "whitespace-nowrap text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600";

  const mobileLinkClass =
    "block w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-[0_4px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      {/* Gold luxury accent */}
      <div className="h-1 bg-gradient-to-r from-[#b88732] via-[#f5dfaa] to-[#b88732]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-3 lg:min-h-[84px] lg:gap-5">

          {/* Logo and welcome greeting */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link
              to="/"
              onClick={closeMenus}
              aria-label="NGM & Luxury home"
              className="flex shrink-0 items-center"
            >
              <img
                src={Logo}
                alt="NGM & Luxury"
                className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105 sm:h-14"
              />
            </Link>

            {isLoggedIn && !isAdmin && (
              <div className="hidden items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 xl:flex">
                <span className="text-xl" aria-hidden="true">
                  👋
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Welcome, {lastName}!
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Good to see you again
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Desktop search */}
          <div className="hidden min-w-0 max-w-lg flex-1 lg:block">
            <SearchForm />
          </div>

          {/* Desktop navigation */}
          <div className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-6">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className={linkClass}>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin" className={linkClass}>
                  Admin Panel
                </Link>

                <Link to="/admin/orders" className={linkClass}>
                  Orders
                </Link>

                <Link to="/admin/proofs" className={linkClass}>
                  Proofs
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Shopping cart */}
                <Link
                  to="/cart"
                  onClick={closeMenus}
                  className="group flex items-center gap-2 text-gray-600 transition hover:text-blue-600"
                >
                  <span className="relative">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3h2l2.4 11.5a2 2 0 002 1.5h7.8a2 2 0 001.9-1.4L21 8H6"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="20"
                        r="1.2"
                        strokeWidth="1.7"
                      />
                      <circle
                        cx="18"
                        cy="20"
                        r="1.2"
                        strokeWidth="1.7"
                      />
                    </svg>

                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>

                  <span className="text-sm font-medium">
                    Cart
                  </span>
                </Link>

                {/* Customer orders */}
                <Link
                  to="/orders"
                  onClick={closeMenus}
                  className="flex items-center gap-2 text-gray-600 transition hover:text-blue-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 3v5h5M9 12h6M9 16h6"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>

                  <span className="whitespace-nowrap text-sm font-medium">
                    My Orders
                  </span>
                </Link>

                {/* Customer profile dropdown */}
                <div
                  ref={profileRef}
                  className="relative border-l border-gray-200 pl-4"
                >
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 transition hover:bg-blue-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-indigo-500 text-sm font-bold text-white shadow-sm">
                      {lastName.charAt(0).toUpperCase()}
                    </span>

                    <span className="max-w-[90px] truncate text-sm font-medium text-slate-700">
                      {lastName}
                    </span>

                    <svg
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.14)]">
                      <div className="border-b border-gray-100 px-3 py-3">
                        <p className="text-xs text-gray-400">
                          Signed in as
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                          {userName}
                        </p>
                      </div>

                      <Link
                        to="/cart"
                        onClick={closeMenus}
                        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 3h2l2.4 11.5a2 2 0 002 1.5h7.8a2 2 0 001.9-1.4L21 8H6"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Shopping Cart
                      </Link>

                      <Link
                        to="/orders"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 3v5h5M9 12h6M9 16h6"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                        My Orders
                      </Link>

                      <div className="my-2 border-t border-gray-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M10 17l5-5-5-5M15 12H3m9-9h6a2 2 0 012 2v14a2 2 0 01-2 2h-6"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={
              open ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={open}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-gray-100 lg:hidden"
          >
            {open ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-gray-100 pb-5 pt-4 lg:hidden">
            {isLoggedIn && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-blue-50 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-indigo-500 font-bold text-white">
                  {lastName.charAt(0).toUpperCase()}
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Welcome, {lastName}!
                  </p>
                  <p className="text-xs text-gray-500">
                    Good to see you again
                  </p>
                </div>
              </div>
            )}

            {/* Mobile search */}
            <div className="mb-4">
              <SearchForm mobile />
            </div>

            {/* Mobile links */}
            <div className="space-y-1">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className={mobileLinkClass}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMenus}
                    className={mobileLinkClass}
                  >
                    Admin Panel
                  </Link>

                  <Link
                    to="/admin/orders"
                    onClick={closeMenus}
                    className={mobileLinkClass}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/admin/proofs"
                    onClick={closeMenus}
                    className={mobileLinkClass}
                  >
                    Payment Proofs
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/cart"
                    onClick={closeMenus}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span>Cart</span>

                    {cartCount > 0 && (
                      <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/orders"
                    onClick={closeMenus}
                    className={mobileLinkClass}
                  >
                    My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Brand footer */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              <span className="h-px w-8 bg-[#d4af6a]" />
              NGM & Luxury
              <span className="h-px w-8 bg-[#d4af6a]" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;