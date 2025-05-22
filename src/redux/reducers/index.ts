import { combineReducers } from '@reduxjs/toolkit';
import bookSlice from '../slices/bookSlice';

export const rootReducer = combineReducers({
  book: bookSlice,
});
