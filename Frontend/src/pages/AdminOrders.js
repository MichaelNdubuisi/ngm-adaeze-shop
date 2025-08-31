import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import API_BASE_URL from '../api';

const statusOptions = ['Processing', 'Shipped', 'Delivered'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/orders`, {
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

  const handleStatusChange = (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || 'Failed to update status');
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      })
      .catch(err => {
        setError(err.message || 'Failed to update status');
      });
  };

  const handleApprove = (orderId) => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/orders/${orderId}/approve`, {
      method: 'PUT',
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || 'Failed to approve order');
        setOrders(orders.map(order => order._id === orderId ? { ...order, isPaid: true, status: 'Processing' } : order));
      })
      .catch(err => {
        setError(err.message || 'Failed to approve order');
      });
  };

  const filteredOrders = orders.filter(order => {
    return (
      (!filterStatus || order.status === filterStatus) &&
      (!filterEmail || order.email.toLowerCase().includes(filterEmail.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-2xl mb-2">⚠️</div>
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Orders</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)} 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Filter by email" 
              value={filterEmail} 
              onChange={e => setFilterEmail(e.target.value)} 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">No orders match your current filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                  </div>
                  <div className="text-xl font-bold text-blue-600 mt-2 sm:mt-0">Total: ${order.total.toFixed(2)}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Customer Information</h4>
                    <p className="text-gray-600"><span className="font-medium">Name:</span> {order.name}</p>
                    <p className="text-gray-600"><span className="font-medium">Email:</span> {order.email}</p>
                    <p className="text-gray-600"><span className="font-medium">Address:</span> {order.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Order Status</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                      <select 
                        value={order.status || ''} 
                        onChange={e => handleStatusChange(order._id, e.target.value)} 
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      {!order.isPaid && (
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                          onClick={() => handleApprove(order._id)}
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {order.paymentResult && order.paymentResult.screenshot && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Payment Proof</h4>
                    <a href={order.paymentResult.screenshot} target="_blank" rel="noopener noreferrer" className="inline-block">
                      <img 
                        src={order.paymentResult.screenshot} 
                        alt="Payment Proof" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      />
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {order.items.map(item => (
                      <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-gray-700">${item.price} each</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
