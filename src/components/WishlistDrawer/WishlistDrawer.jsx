import React, { useEffect, useState } from "react";
import "./WishlistDrawer.css";

const LS_WISHLIST_KEY = "app_wishlist";

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeLS = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export default function WishlistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(() => readLS(LS_WISHLIST_KEY, []));

  useEffect(() => {
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(v => !v);
    const onWishMutate = () => setItems(readLS(LS_WISHLIST_KEY, []));

    window.addEventListener("ui:wishlist:open", open);
    window.addEventListener("ui:wishlist:close", close);
    window.addEventListener("ui:wishlist:toggle", toggle);

    window.addEventListener("wishlist:add", onWishMutate);
    window.addEventListener("wishlist:remove", onWishMutate);
    window.addEventListener("wishlist:toggle", onWishMutate);
    window.addEventListener("storage", onWishMutate);

    return () => {
      window.removeEventListener("ui:wishlist:open", open);
      window.removeEventListener("ui:wishlist:close", close);
      window.removeEventListener("ui:wishlist:toggle", toggle);

      window.removeEventListener("wishlist:add", onWishMutate);
      window.removeEventListener("wishlist:remove", onWishMutate);
      window.removeEventListener("wishlist:toggle", onWishMutate);
      window.removeEventListener("storage", onWishMutate);
    };
  }, []);

  const closeDrawer = () => setIsOpen(false);

  const removeItem = (id) => {
    const next = items.filter(p => p.id !== id);
    setItems(next);
    writeLS(LS_WISHLIST_KEY, next);
    window.dispatchEvent(new CustomEvent("wishlist:remove", { detail: { id } }));
  };

  const addToCart = (item) => {
    // Event fire (Header badge update) + App.jsx listener will actually add in cart state
    window.dispatchEvent(new CustomEvent("cart:add", {
      detail: {
        id: item.id,
        title: item.title,
        image: item.image,
        quantity: 1,
        price: item.price || 0
      }
    }));
  };

  return (
    <>
      {isOpen && <div className="wl-overlay" onClick={closeDrawer} />}

      <aside className={`wl-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        {/* Row 1: Header */}
        <div className="wl-header">
          <h3><i className="fas fa-heart"></i> Wishlist</h3>
          <button className="wl-close" onClick={closeDrawer} aria-label="Close wishlist">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Row 2: Either Empty OR List (NO fragment) */}
        {items.length === 0 ? (
          <div className="wl-empty">
            <i className="far fa-heart"></i>
            <h4>Your wishlist is empty</h4>
            <p>Add some products you love and they’ll show up here.</p>
          </div>
        ) : (
          <div className="wl-list">
            {items.map((it) => (
              <div key={it.id} className="wl-item">
                <img
                  src={it.image || "https://via.placeholder.com/80"}
                  alt={it.title}
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/80")}
                />
                <div className="wl-info">
                  <div className="wl-title">{it.title || `Item #${it.id}`}</div>
                  <div className="wl-actions">
                    <button className="wl-add" onClick={() => addToCart(it)}>
                      <i className="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button className="wl-remove" onClick={() => removeItem(it.id)}>
                      <i className="fas fa-trash-alt"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Row 3: Footer only when items exist (NO fragment) */}
        {items.length > 0 && (
          <div className="wl-footer">
            <button className="wl-close-btn" onClick={closeDrawer}>Close</button>
          </div>
        )}
      </aside>
    </>
  );
}
