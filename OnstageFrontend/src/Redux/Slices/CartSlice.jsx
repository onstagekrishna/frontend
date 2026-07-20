import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "Cart",
  initialState,

  reducers: {
    // ✅ ADD TO CART (FIXED)
    addToCart: (state, action) => {
      const item = action.payload;
      if (!item) return;

      const product_id = item.product_id || item._id || item.id;
      if (!product_id) return;

      const price = parseFloat(item.Product_price ?? item.price ?? 0);
      if (isNaN(price) || price <= 0) return;

      let qty = Number(item.quantity);
      if (isNaN(qty) || qty < 1) qty = 1;

      const stock = Number(item.Product_Quantity ?? item.stock ?? 0);

      const existing = state.items.find(
        (i) => i.product_id === product_id
      );

      if (existing) {
        // 🔥 FIX: SET quantity (no addition)
        let updatedQty = qty;

        if (stock > 0 && updatedQty > stock) {
          updatedQty = stock;
        }

        existing.quantity = updatedQty;

      } else {
        state.items.push({
          ...item,
          product_id,
          Product_price: price,
          Product_Quantity: stock,
          quantity: stock > 0 ? Math.min(qty, stock) : qty,
        });
      }

      saveCart(state.items);
    },

    remove: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload
      );
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },

    increaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i.product_id === action.payload
      );

      if (!item) return;

      const stock = Number(item.Product_Quantity || 0);

      if (stock > 0 && item.quantity >= stock) return;

      item.quantity += 1;
      saveCart(state.items);
    },

    decreaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i.product_id === action.payload
      );

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      }

      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  remove,
  clearCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;

export default cartSlice.reducer;