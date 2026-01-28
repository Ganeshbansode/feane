import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

/* USER COMPONENTS */
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Menu from "./components/Menu";
import About from "./components/About";
import Footer from "./components/Footer";
import BookTable from "./components/BookTable";
import AboutReviews from "./components/AboutReviews";
import Cart from "./components/Cart";
import Search from "./components/Search";
import CartDrawer from "./components/CartDrawer";
import Account from "./components/Account";
import DeliveryPopup from "./components/DeliveryPopup";

/* PAGES */
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";

/* ADMIN */
import AdminApp from "./admin/AdminApp";

/* CONTEXT */
import { CartProvider } from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { showLogin } = useAuth();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <CartDrawer />}
      <Toaster position="top-right" />

      {showLogin && <Login />}

      {/* USER ROUTES */}
      {!isAdmin && (
        <div className="app-scroll">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <Menu />
                  <BookTable />
                  <About />
                  <Footer />
                </>
              }
            />
            <Route path="/account" element={<><Account /><Footer /></>} />
            <Route path="/search" element={<><Search /><Footer /></>} />
            <Route path="/reviews" element={<><AboutReviews /><Footer /></>} />
            <Route path="/cart" element={<><Cart /><Footer /></>} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      )}

      {/* ADMIN ROUTES (NO app-scroll) */}
      {isAdmin && (
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <AuthProvider>
      <CartProvider>
        <FavouriteProvider>
          <BrowserRouter>
            {showPopup && (
              <DeliveryPopup onClose={() => setShowPopup(false)} />
            )}
            <AppContent />
          </BrowserRouter>
        </FavouriteProvider>
      </CartProvider>
    </AuthProvider>
  );
}
