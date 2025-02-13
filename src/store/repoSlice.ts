// src/store/reposSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ComponentProps } from "../utls/type";

interface ReposState {
  repos: ComponentProps[];
}

const initialState: ReposState = {
  repos: [],
};

const reposSlice = createSlice({
  name: "repos",
  initialState,
  reducers: {
    setRepos: (state, action: PayloadAction<ComponentProps[]>) => {
      state.repos = action.payload;
    },
    addRepos: (state, action: PayloadAction<ComponentProps[]>) => {
      state.repos.push(...action.payload);
    },
  },
});

export const { setRepos, addRepos } = reposSlice.actions;

export default reposSlice.reducer;
