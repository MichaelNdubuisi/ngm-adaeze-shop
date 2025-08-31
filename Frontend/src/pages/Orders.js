import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    fetch('/api/orders', {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || 'Failed to fetch orders');
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch orders');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-6 sm:py-8 px-2 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">You have not placed any orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/orders/${order.id}`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <div>
                  <span className="font-semibold">Order #{order.id}</span>
                  <span className="ml-3 text-gray-500 text-xs">{new Date(order.date).toLocaleString()}</span>
                </div>
                <div className="font-bold text-black mt-2 sm:mt-0">Total: ${order.total.toFixed(2)}</div>
              </div>
              <div className="text-gray-700 mb-2"><span className="font-semibold">Name:</span> {order.name}</div>
              <div className="text-gray-700 mb-2"><span className="font-semibold">Email:</span> {order.email}</div>
              <div className="text-gray-700 mb-2"><span className="font-semibold">Address:</span> {order.address}</div>
              <div><span className="font-semibold">Status:</span> <span className="text-blue-700 font-semibold">{order.status || 'Processing'}</span></div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
