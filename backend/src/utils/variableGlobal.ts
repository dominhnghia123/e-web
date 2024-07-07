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
  notOrderedYet = 'notOrderedYet',
  notPaymentDone = 'notPaymentDone',
  notShippedYet = 'notShippedYet',
  shipping = 'shipping',
  shipped = 'shipped',
  cancel = 'cancel',
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
