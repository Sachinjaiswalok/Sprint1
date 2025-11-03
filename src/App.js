import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { ShoppingBag, Menu, Search, User, Heart, X } from "lucide-react";
import Men from "./Shop/Men";
import Women from "./Shop/Women";
import Accessories from "./Shop/Accessories";
import productsData from "./Data/Product";
import AdminPanel from "./pages/Adminpanels";
import "./index.css";
import { useLocation } from "react-router-dom";

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const location = useLocation();

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const updateQuantity = (productId, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const toggleUserMenu = () => {
    console.log("toggle dropdown");
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleAdminClick = () => {
    setIsUserMenuOpen(false); // Close the dropdown
    navigate("/admin"); // Navigate to admin panel
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-800 lg:hidden" />
              <div className="hidden lg:flex lg:space-x-8">
                <Link
                  to="/collections"
                  className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium"
                >
                  Collections
                </Link>
                <Link
                  to="/Shop/Men"
                  className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium"
                >
                  Men
                </Link>
                <Link
                  to="/Shop/Women"
                  className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium"
                >
                  Women
                </Link>
                <Link
                  to="/Shop/Accessories"
                  className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium"
                >
                  Accessories
                </Link>
              </div>
            </div>

            <div className="text-2xl font-serif text-center">
              MAISON ÉLÉGANCE
            </div>

            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-800" />

              {/* User Dropdown */}
              <div className="relative">
                <User
                  className="h-5 w-5 text-gray-800 cursor-pointer"
                  onClick={toggleUserMenu}
                />
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
                    <button className="block px-4 py-2 text-sm text-gray-700 w-full text-left">
                      User
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                      onClick={handleAdminClick}
                    >
                      Admin
                    </button>
                  </div>
                )}
              </div>
              <Heart className="h-5 w-5 text-gray-800" />
              <div className="relative">
                <ShoppingBag
                  className="h-5 w-5 text-gray-800"
                  onClick={() => setIsCartOpen(true)}
                />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform 
    transition-all duration-300 ease-in-out 
    ${isCartOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)}>
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[70vh]">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded"
                />
                <div>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-gray-500">
                    ${item.price} × {item.quantity}
                  </p>
                  {/* Quantity Controls */}
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 bg-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Total & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t">
            <p className="text-lg font-semibold">
              Total: ${getTotalPrice().toFixed(2)}
            </p>
            <button className="w-full bg-black text-white py-2 mt-2 rounded hover:bg-gray-800">
              Checkout
            </button>
          </div>
        )}
      </div>

      {location.pathname !== "/admin" && (
        <>
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80"
              alt="Luxury Fashion"
              className="w-full h-[80vh] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white">
                <h1 className="text-5xl font-serif mb-4">
                  Autumn Collection 2025
                </h1>
                <p className="text-xl mb-8">
                  Timeless Elegance, Modern Sophistication
                </p>
                <button className="bg-white text-gray-900 px-8 py-3 text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors">
                  Discover Now
                </button>
              </div>
            </div>
          </div>

          {/* Featured Categories */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                <img
                  src="https://images.unsplash.com/photo-1525845859779-54d477ff291f?auto=format&fit=crop&q=80"
                  alt="Men's Collection"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-serif">Men</span>
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80"
                  alt="Women's Collection"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-serif">Women</span>
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                <img
                  src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80"
                  alt="Accessories"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-serif">
                    Accessories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/shop/men" element={<Men addToCart={addToCart} />} />

        <Route path="/shop/women" element={<Women addToCart={addToCart} />} />
        <Route
          path="/shop/accessories"
          element={<Accessories addToCart={addToCart} />}
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-serif mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                MAISON ÉLÉGANCE represents the pinnacle of luxury fashion,
                crafting timeless pieces that embody sophistication and style.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Contact Us</li>
                <li>Shipping & Returns</li>
                <li>Size Guide</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Store Locator</li>
                <li>Gift Cards</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to receive updates, access to exclusive deals, and
                more.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 MAISON ÉLÉGANCE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
