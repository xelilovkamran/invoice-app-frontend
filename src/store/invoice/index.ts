import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { type TInvoice, type TInvoiceStatus } from "@/types/types";
import api from "@/utils/api";

interface CustomError {
  message?: string;
}

type InvoiceState = {
  invoices: TInvoice[];
  invoice: null | TInvoice;
  filterBy: TInvoiceStatus | "filterless";
};

const initialState: InvoiceState = {
  invoices: [],
  invoice: null,
  filterBy: "filterless",
};

export const getInvoices = createAsyncThunk("invoice/getInvoices", async () => {
  const res = await api.get("/invoices/");
  const invoices = await res.data;

  return invoices;
});

export const postInvoice = createAsyncThunk(
  "invoice/postInvoice",
  async (invoice: Omit<TInvoice, "id" | "total">) => {
    const res = await api.post("/invoices/", JSON.stringify(invoice), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newInvoice = await res.data;

    return newInvoice;
  }
);

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setFilterBy: (
      state,
      action: PayloadAction<TInvoiceStatus | "filterless">
    ) => {
      state.filterBy = action.payload;
    },

    selectInvoice: (state, action: PayloadAction<TInvoice>) => {
      state.invoice = action.payload;
    },

    setInvoices: (state, action: PayloadAction<TInvoice[]>) => {
      state.invoices = action.payload;
    },
  },

  extraReducers: (builder) => {
    // getInvoices
    builder.addCase(
      getInvoices.fulfilled,
      (state, action: PayloadAction<TInvoice[]>) => {
        state.invoices = action.payload;
      }
    );

    builder.addCase(
      getInvoices.rejected,
      (
        _state,
        action: PayloadAction<unknown, string, unknown, CustomError>
      ) => {
        action.error.message === "bad connection"
          ? toast.error("Bad connection")
          : toast.error("Something went wrong");
      }
    );

    // postInvoice
    builder.addCase(
      postInvoice.fulfilled,
      (state, action: PayloadAction<TInvoice>) => {
        state.invoices = [...state.invoices, action.payload];
        toast.success("Invoice created successfully :)");
      }
    );

    builder.addCase(
      postInvoice.rejected,
      (
        _state,
        action: PayloadAction<unknown, string, unknown, CustomError>
      ) => {
        console.log(action);
        action.error.message === "bad connection"
          ? toast.error("Bad connection")
          : toast.error("Something went wrong");
      }
    );
  },
});

export const invoiceActions = invoiceSlice.actions;

export default invoiceSlice.reducer;
