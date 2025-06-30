import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import type { CartItem } from "../../types/cart";


interface OrderProps {
  id: string;
  status: string;
  priority: boolean;
  priorityPrice: number;
  orderPrice: number;
  estimatedDelivery: string;
  cart: CartItem[];
}

function Order() {
  const order = useLoaderData() as OrderProps;

  const { status, priority, priorityPrice, orderPrice, estimatedDelivery } =
    order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div>
      <div>
        <h2>Status</h2>
        <div>
          {priority && <span>Priority</span>}
          <span>{status} order</span>
        </div>
      </div>

      <div>
        <p>
          {deliveryIn >= 0
            ? `Only ${deliveryIn} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      <div>
        <p>Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p>To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  );
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<OrderProps> {
  const order = await getOrder(params.orderId!);
  console.log(order);
  return order;
}

export default Order;
