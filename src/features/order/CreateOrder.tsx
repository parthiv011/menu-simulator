// import { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import type { OrderInput } from '../../types/cart';
import { Button } from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { clearCart, getCart, getTotalPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store, { type AppDispatch } from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state: RootState) => state.user);

  const isLoadingAddress = addressStatus === 'loading';
  const navigation = useNavigation();

  const formErrors = useActionData() as Record<string, string> | undefined;
  const dispatch = useDispatch<AppDispatch>();
  const isSubmitting = navigation.state === 'submitting';

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) {
    return <EmptyCart />;
  }

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            defaultValue={username}
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && (
            <p className="mt-2 rounded-md bg-red-100 text-xs text-red-700">
              {formErrors.phone}
            </p>
          )}
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-10 sm:right-[5px] sm:top-[5px]">
              <Button
                type="small"
                disabled={isLoadingAddress}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Address
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority.toString()}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <div>
          <Button disabled={isSubmitting}>
            {isSubmitting
              ? 'Placing order...'
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Safely extract values from `data`
  const cart = JSON.parse(data.cart as string);
  const priority = data.priority === 'true';
  const customer = data.customer as string;
  const phone = data.phone as string;
  const address = data.address as string;
  console.log(address);

  const order: OrderInput = {
    cart,
    priority,
    customer,
    phone,
    address,
    orderPrice: 0,
    priorityPrice: 0,
    estimatedDelivery: '',
    status: 'pending',
  };

  const errors: Record<string, string> = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      'Please give us your correct phone number. We might need to contact you.';
  }

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  // Clear cart after placing order
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
