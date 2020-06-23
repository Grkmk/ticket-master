import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

import useRequst from '../../hooks/use-request';

const STRIPE_PUB_KEY =
  'pk_test_51GwtxSBE8Ub3gKITdUGDnR4LMWGFENv3gaV31XECBcCw1ySTMpOFwyijAZ2wrgzf96l9LVkIylBQC2XP425FNOi0003prmknun';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequst({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    if (timeLeft < 0) return () => clearInterval(timerId);
    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft < 0) return <div>order expired</div>;

  return (
    <div>
      {timeLeft} seconds until expiration
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={STRIPE_PUB_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
