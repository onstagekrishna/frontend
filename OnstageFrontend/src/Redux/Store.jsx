import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/AuthSlice";
import wishlistReducer from "./Slices/WishlistSlice";
import cartReducer from "./Slices/CartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    Wishlist: wishlistReducer,
    Cart: cartReducer,
  },

  // 🔥 DevTools (development me useful)
  devTools: process.env.NODE_ENV !== "production",
});