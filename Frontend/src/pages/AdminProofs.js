import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import API_BASE_URL from '../api';

const AdminProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/payment-proofs`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || 'Failed to fetch payment proofs');
        setProofs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch payment proofs');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment proofs...</p>
        </div>
      </div>
    </AdminLayout>
  );

  if (error) return (
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

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Proof Submissions</h1>
          <p className="text-gray-600">Review customer payment proof submissions</p>
        </div>

        {proofs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payment Proofs Yet</h3>
            <p className="text-gray-500">No payment proof submissions have been received yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofs.map(proof => (
              <div key={proof._id} className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {proof.name}</p>
                    <p className="text-gray-700"><span className="font-medium">Email:</span> {proof.email}</p>
                    <p className="text-gray-500 text-xs">
                      Submitted: {new Date(proof.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {proof.message && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Message</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{proof.message}</p>
                  </div>
                )}

                {proof.product && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Product</h4>
                    <Link 
                      to={`/product/${proof.product}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Product →
                    </Link>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Payment Proof</h4>
                  <a 
                    href={proof.image} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <img 
                      src={proof.image} 
                      alt="Payment proof" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:shadow-md transition-shadow"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Click to view full size</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProofs;
