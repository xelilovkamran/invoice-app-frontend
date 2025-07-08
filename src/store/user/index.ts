import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { type TUserData } from "@/types/types";
import api from "@/utils/api";

interface CustomError {
  message?: string;
}

const initialState: TUserData = {
  fullname: "",
  email: "",
  avatar: "",
};

export const getUserData = createAsyncThunk("user/getUserData", async () => {
  const res = await api.get("/account/details/");
  const data = await res.data;
  return data;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<TUserData>) => {
      state.fullname = action.payload.fullname;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getUserData.rejected,
      (
        _state,
        action: PayloadAction<unknown, string, unknown, CustomError>
      ) => {
        action.error.message === "bad connection"
          ? toast.error("Bad connection")
          : toast.error("Something went wrong");
      }
    );

    builder.addCase(
      getUserData.fulfilled,
      (state, action: PayloadAction<TUserData>) => {
        state.fullname = action.payload.fullname;
        state.email = action.payload.email;
        state.avatar = import.meta.env.VITE_API_URL + action.payload.avatar;
      }
    );
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
