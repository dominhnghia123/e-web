interface IOrderItem {
  cartId: string;
  productId: string;
  variantId: string;
  quantity: string;
  price: string;
}

interface IOrder {
  _id: string;
  userId: string;
  address: string;
  coupon: string;
  orderItems: IOrderItem[];
  totalPrice: string;
  status: string;
  session_id: string;
  status_delivery: string;
  createdAt: date;
  updatedAt: date;
}
