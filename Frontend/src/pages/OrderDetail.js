import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const statusOptions = ['Processing', 'Shipped', 'Delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = allOrders.find(o => String(o.id) === String(id));
    setOrder(found);
  }, [id]);

  if (!order) {
    return <div className="container mx-auto py-10 text-center text-gray-600">Order not found. <button onClick={() => navigate('/orders')} className="underline text-black">Back to Orders</button></div>;
  }

  return (
    <div className="container mx-auto py-8 px-2 sm:px-0 max-w-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Order #{order.id}</h2>
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div><span className="font-semibold">Placed:</span> {new Date(order.date).toLocaleString()}</div>
        <div><span className="font-semibold">Status:</span> <span className="text-blue-700 font-semibold">{order.status || 'Processing'}</span></div>
        <div><span className="font-semibold">Name:</span> {order.name}</div>
        <div><span className="font-semibold">Email:</span> {order.email}</div>
        <div><span className="font-semibold">Address:</span> {order.address}</div>
        <div><span className="font-semibold">Total:</span> <span className="text-black">${order.total.toFixed(2)}</span></div>
        <div>
          <span className="font-semibold">Items:</span>
          <ul className="list-disc ml-5 mt-1">
            {order.items.map(item => (
              <li key={item._id} className="text-sm text-gray-800">
                {item.name} x {item.quantity} (${item.price} each)
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => navigate('/orders')} className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-black">Back to Orders</button>
      </div>
    </div>
  );
};

export default OrderDetail;
