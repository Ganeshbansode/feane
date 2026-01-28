import { useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";

import { FiUser, FiShoppingCart, FiSearch } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";

import Login from "../pages/Login";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  window.openLoginModal = () => {
  setShowLogin(true);
};

  const { user } = useAuth();
  const { totalQty, isDrawerOpen } = useCart();
  const { favourites } = useFavourite();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId) => {
    setIsOpen(false);

    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <>
      <header className={`header ${isOpen ? "open-nav" : ""} ${isDrawerOpen ? "header-disabled" : ""}`}>
        <div className="header-inner">
          <div className="header-left">
            <div className="logo" onClick={() => handleNavClick("home")}>
              Feane
            </div>
          </div>

          <nav className={`nav-links header-center ${isOpen ? "open" : ""}`}>
            <button onClick={() => handleNavClick("home")}>HOME</button>
            <button onClick={() => handleNavClick("menu")}>MENU</button>
            <button onClick={() => handleNavClick("about")}>ABOUT</button>
            <button onClick={() => handleNavClick("book-table")}>BOOK TABLE</button>
            <button onClick={() => handleNavClick("offers")}>OFFER</button>
          </nav>

          <div className="header-right">
  {user ? (
    <div className="nav-user" onClick={() => navigate("/account")}>
      <FiUser className="icon" />
      <div className="nav-user-text">
        <span className="nav-welcome">Welcome</span>
        <span className="nav-name">{user.name}</span>
      </div>
    </div>
  ) : (
    <FiUser className="icon" onClick={() => setShowLogin(true)} />
  )}

  <div className="cart-wrapper" onClick={() => navigate("/cart")}>
    <FiShoppingCart className="icon" />
    {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
  </div>

  {/* MOVED AFTER CART */}
  <div className="fav-count">
    <AiOutlineHeart />
    {favourites.length > 0 && <small>{favourites.length}</small>}
  </div>

  <div
    className="search-icon"
    onClick={() => navigate("/search")}
  >
    <FiSearch className="icon" />
  </div>
</div>


          <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "✖" : "☰"}
          </div>
        </div>
      </header>

      <div className={`header-space ${isOpen ? "active" : ""}`} />

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
}
