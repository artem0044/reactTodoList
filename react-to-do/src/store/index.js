import { configureStore } from "@reduxjs/toolkit";
import toDosListSlice from './toDoSlice.js';

export default configureStore({
  reducer: {
    toDosList: toDosListSlice,
  }
})