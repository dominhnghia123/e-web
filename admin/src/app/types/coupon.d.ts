interface ICoupon {
    _id: string;
    userId: IUser;
    name: string;
    expiry: string;
    discount: string;
    createdAt: date;
    updatedAt: date;
}
