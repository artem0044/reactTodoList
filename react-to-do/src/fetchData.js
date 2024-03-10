import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = (method, type, url) => createAsyncThunk(type, async (options, { rejectWithValue }) => {
  try {
    const res = await fetch(url, {
      method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
    return await res.json();

  } catch (error) {
    rejectWithValue(error.message);
  }
});

