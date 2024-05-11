import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    getProductsCheckout: ProductState;
};

type ProductState = {
    checkedList: any;
    quantityPurchase: string;
    voucherId: string;
    addressId: string;
    totalPriceBeforeApllyCoupon: string
};

const initialState = {
    getProductsCheckout: {
        checkedList: [],
        quantityPurchase: "",
        voucherId: "",
        addressId: ""
    } as ProductState,
} as InitialState;

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        getProductsCheckout: (state, action: PayloadAction<any>) => {
            state.getProductsCheckout.checkedList = action.payload?.checkedList;
            state.getProductsCheckout.quantityPurchase = action.payload?.quantityPurchase;
            state.getProductsCheckout.voucherId = action.payload?.selectedCouponId;
            state.getProductsCheckout.addressId = action.payload?.selectedAddressId;
            state.getProductsCheckout.totalPriceBeforeApllyCoupon = action.payload?.totalPriceBeforeApllyCoupon;
        },
    },
});

export const {
    getProductsCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
