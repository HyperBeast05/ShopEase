import { useState, useCallback, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import api from "../api/axios";

function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCart(response.data.data);
      setCartQuantity(response.data.totalQuantity);
      setCartTotal(response.data.totalAmount);
    } catch (error) {
      console.error("Error fetching cart:", error);

      setError(error.response?.data?.message || "Failed to load Cart");

      setCart([]);
      setCartQuantity(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      const response = await api.post("/cart", {
        product_id: productId,
        quantity: quantity,
      });

      await fetchCart();

      return response.data;
    } catch (error) {
      console.error("Error adding product to cart:", error);

      throw error;
    }
  };

  const createOrder = async () => {
    try {
      const response = await api.post("/orders");

      // Backend has already cleared the database cart.
      // Clear the corresponding React cart state.
      clearCart();
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);

      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await api.delete(`/cart/${cartItemId}`);

      await fetchCart();

      return response.data;
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      const response = await api.put(`/cart/${cartItemId}`, {
        quantity: newQuantity,
      });

      await fetchCart();

      return response.data;
    } catch (error) {
      console.error("Error updating cart quantity:", error);

      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartQuantity(0);
    setCartTotal(0);
  };

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const loadCart = async () => {
      await fetchCart();
    };
    loadCart();
  }, [user, fetchCart]);

  const visibleCart = user ? cart : [];
  const visibleCartQuantity = user ? cartQuantity : 0;
  const visibleCartTotal = user ? cartTotal : 0;
  const visibleLoading = user ? loading : false;
  const visbileError = user ? error : "";

  return (
    <CartContext.Provider
      value={{
        cart: visibleCart,
        cartQuantity: visibleCartQuantity,
        cartTotal: visibleCartTotal,
        loading: visibleLoading,
        error: visbileError,
        fetchCart,
        addToCart,
        createOrder,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export default CartProvider;
