import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const initialState = {
  data: [],
  post: null,
  status: false,
};

export const fetchPost = createAsyncThunk("post/fetchPost", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
});

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postData: (state, action) => {
      state.data.push(action.payload);
    },
    updatePost: (state, action) => {
      state.post = action.payload;
    },
    deletePost: (state, action) => {
      state.data = state.data.filter((el) => el.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

// Action creators are generated for each case reducer function
export const { getPost, postData, updatePost, deletePost } = postSlice.actions;

export default postSlice.reducer;
