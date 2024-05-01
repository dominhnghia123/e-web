import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    getProductsBySearch: ProductState;
};

type ProductState = {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    products: IProduct | null;
    page: number;
    limit: number;
    keySearch: string
};

const initialState = {
    getProductsBySearch: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        products: null,
        page: 1,
        limit: 10,
        keySearch: ""
    } as ProductState,
} as InitialState;

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        getProductsBySearchStart: (state) => {
            state.getProductsBySearch.isLoading = true;
            state.getProductsBySearch.isError = false;
            state.getProductsBySearch.isSuccess = false;
        },
        getProductsBySearchError: (state) => {
            state.getProductsBySearch.isLoading = false;
            state.getProductsBySearch.isError = true;
            state.getProductsBySearch.isSuccess = false;
        },
        getProductsBySearchSuccess: (state, action: PayloadAction<any>) => {
            state.getProductsBySearch.isLoading = false;
            state.getProductsBySearch.isError = false;
            state.getProductsBySearch.isSuccess = true;
            state.getProductsBySearch.products = action.payload?.products;
            state.getProductsBySearch.page = action.payload?.page;
            state.getProductsBySearch.limit = action.payload?.limit;
            state.getProductsBySearch.keySearch = action.payload?.keySearch;
        },
    },
});

export const {
    getProductsBySearchStart,
    getProductsBySearchError,
    getProductsBySearchSuccess,
} = productSlice.actions;

export default productSlice.reducer;
