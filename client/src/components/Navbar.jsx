import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePayment = async () => {
    try {
      const { data } = await API.post("/payment/create-order", {
        amount: 100,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "GenScribe AI",
        description: "Buy Credits",
        handler: function (response) {
          console.log("Payment success:", response);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Payment error:", error);
    }
  };

  if (loading) {
    return (
      <nav className="h-16 bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-6">
        <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* BRAND */}
            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                Gen<span className="text-indigo-400">Scribe</span>
              </span>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-2">
              {!user ? (
                <>
                  <Link to="/login">
                    <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all duration-200 shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  {/* NAV LINKS */}
                  <Link to="/dashboard">
                    <button className="px-3.5 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </button>
                  </Link>

                  <Link to="/analytics">
                    <button className="px-3.5 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Analytics
                    </button>
                  </Link>

                  <button
                    onClick={handlePayment}
                    className="px-3.5 py-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 rounded-lg hover:bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Billing
                  </button>

                  {/* DIVIDER */}
                  <div className="w-px h-6 bg-white/10 mx-1" />

                  {/* USER AVATAR & NAME */}
                  <div className="flex items-center gap-2.5 pl-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm text-gray-300 font-medium max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </div>

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="ml-1 p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                    title="Logout"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-gray-950/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {!user ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all text-left">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all text-center">
                      Get Started
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* USER INFO */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-white/[0.03]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-sm font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">Manage your account</p>
                    </div>
                  </div>

                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all text-left flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </button>
                  </Link>

                  <Link to="/analytics" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all text-left flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Analytics
                    </button>
                  </Link>

                  <button
                    onClick={() => { handlePayment(); setMobileOpen(false); }}
                    className="w-full px-3 py-2.5 text-sm font-medium text-indigo-300 hover:text-indigo-200 rounded-lg hover:bg-indigo-500/10 transition-all text-left flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Billing
                  </button>

                  <div className="border-t border-white/[0.06] mt-2 pt-2">
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all text-left flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
