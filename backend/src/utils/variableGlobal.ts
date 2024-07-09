export enum roleUserEnum {
  admin = 'admin',
  user = 'user',
}

export enum statusOrderEnum {
  pending = 'pending',
  done = 'done',
  cancel = 'cancel',
}

export enum paymentMethodEnum {
  online = 'online',
  offline = 'offline',
}

export enum statusDeliveryEnum {
  notOrderedYet = 'Chưa đặt hàng',
  notPaymentDone = 'Chưa trả tiền',
  notShippedYet = 'Chưa vận chuyển',
  shipping = 'Đang vận chuyển',
  shipped = 'Đã nhận hàng',
  cancel = 'Đã hủy',
}

export enum genderEnum {
  male = 'male',
  female = 'female',
  other = 'other',
}

export enum colorEnum {
  white = 'white',
  black = 'black',
  brown = 'brown',
  blue = 'blue',
  violet = 'violet',
  pink = 'pink',
}

export enum statusRequestSellerEnum {
  pending = 'pending',
  accept = 'accept',
  refuse = 'refuse',
}
