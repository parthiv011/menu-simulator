export interface CartItem {
  pizzaId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderInput {
  customer: string;
  estimatedDelivery: string;
  orderPrice: number;
  phone: string;
  priorityPrice: number;
  status: string;
  priority: boolean;
  cart: CartItem[];
}

export interface Order extends OrderInput {
  id: string;
}
