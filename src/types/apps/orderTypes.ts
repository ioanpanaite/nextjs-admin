export enum OrderStatus {
  Opened = 'opened',
  Unopened = 'unopened',
  Processing = 'processing',
  Sent = 'sent'
}

export type OrderLayoutProps = {
  id: number | undefined
}

export type OrderClientType = {
  customerId: string
  siteName: string
  accountId: string
  deliveryAddress: string
  phone: string
  email: string
  name: string
  avatarImage: string
}

export type OrderType = {
  id: number
  customerId: string
  supplierId: string

  total: number
  dueDate: string
  siteName: string
  accountId: string
  deliveryAddress: string
  phone: string
  email: string
  name: string
  avatarImage: string
  
  issuedDate: string
  orderStatus: string,
  product: {
    title: string,
    code: string,
    unit: string,
    image?: string,
    quantity: number,
    price: number
  }[],
  orderNote?: string,
  subTotal: number,
  discount: number,
  tax: number
}

export type OrderPaymentType = {
  iban: string
  totalDue: string
  bankName: string
  country: string
  swiftCode: string
}

export type SingleOrderType = {
  order: OrderType
  paymentDetails: OrderPaymentType
}

export interface OrderProduct {
  title: string,
  code: string,
  unit: string,
  image?: string,
  quantity: number,
  price: number
}