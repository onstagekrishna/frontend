import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getTokenFromStorage = () => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  return token;
};

const initialState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload || {};

      state.user = user || null;
      state.token = token || null;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }

      if (token && token !== "undefined" && token !== "null") {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;