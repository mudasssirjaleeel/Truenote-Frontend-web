import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import beanReducer from './slices/beanSlice';
import wishlistReducer from './slices/wishlistSlice';
import cartReducer from './slices/cartSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import contactReducer from './slices/contactSlice';
import subscriptionReducer from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beans: beanReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    addresses: addressReducer,
    orders: orderReducer,
    contact: contactReducer,
    subscriptions: subscriptionReducer,


  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;