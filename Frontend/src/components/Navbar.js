import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Logo from "../assets/images/Logo.png";

const Navbar = () => {
  const { cart } = useCart();
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userName = localStorage.getItem("userName") || "Valued Customer";

  // Extract only last name (handles single word gracefully)
  const lastName = userName.trim().split(" ").slice(-1)[0];

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate(isAdmin ? "/admin-login" : "/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Brand Name + Greeting */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex flex-col items-center text-center"
            >
              <img
                src={Logo}
                alt="NGM & Luxury"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {isLoggedIn && (
              <span className="hidden sm:inline text-gray-700 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                Hi, {lastName}! 
              </span>
            )}
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-6"
          >
            <div className="flex items-center w-full bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200">
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="ml-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-5">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin" className="nav-link">
                  Admin Panel
                </Link>
                <Link to="/admin/orders" className="nav-link">
                  Orders
                </Link>
                <Link to="/admin/proofs" className="nav-link">
                  Proofs
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="relative flex items-center text-gray-700 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h9m-9 
                      0a2 2 0 100 4 2 2 0 000-4zm9 
                      0a2 2 0 100 4 2 2 0 000-4z"
                    />
                  </svg>
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="nav-link">
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  open
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg rounded-b-2xl">
            <div className="p-4 space-y-4">
              {isLoggedIn && (
                <div className="text-center text-gray-700 font-medium">
                  Hi, {lastName}! 🌟
                </div>
              )}

              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </form>

              {/* Mobile Links */}
              <div className="space-y-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
                    >
                      Register
                    </Link>
                  </>
                ) : isAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Admin Panel
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/proofs"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Proofs
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-500 hover:text-white rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/cart"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-500 hover:text-white rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
