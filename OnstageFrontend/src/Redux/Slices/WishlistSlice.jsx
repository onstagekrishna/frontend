import { createSlice } from "@reduxjs/toolkit";

const getWishlistFromStorage = () => {
  try {
    const data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  items: getWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "Wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );

      if (!exists) {
        state.items.push(action.payload);

        // ✅ safe save
        localStorage.setItem("wishlist", JSON.stringify(state.items));
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload
      );

      // ✅ safe update
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const { addToWishlist, removeFromWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;