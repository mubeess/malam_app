import { createSlice } from '@reduxjs/toolkit';
import { CurrentBookType } from '../type';
import { RootState } from '..';

const initialState: CurrentBookType = {
  id: '',
};
const bookSlice = createSlice({
  name: 'currentBook',
  initialState: initialState,
  reducers: {
    setBookId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setBookId } = bookSlice.actions;
export const userSelector = (state: RootState) => state.book;
export default bookSlice.reducer;
