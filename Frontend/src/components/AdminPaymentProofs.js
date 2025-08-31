import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../api';

const AdminPaymentProofs = () => {
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

  if (loading) return <div>Loading payment proofs...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Payment Proof Submissions</h2>
      {proofs.length === 0 ? (
        <div>No payment proofs submitted yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proofs.map(proof => (
            <div key={proof._id} className="border rounded-lg p-4 bg-white shadow">
              <div><span className="font-semibold">Name:</span> {proof.name}</div>
              <div><span className="font-semibold">Email:</span> {proof.email}</div>
              {proof.message && <div><span className="font-semibold">Message:</span> {proof.message}</div>}
              <div><span className="font-semibold">Submitted:</span> {new Date(proof.createdAt).toLocaleString()}</div>
              <div className="mt-2">
                <span className="font-semibold">Screenshot:</span><br />
                <a href={proof.image} target="_blank" rel="noopener noreferrer">
                  <img src={proof.image} alt="Payment proof" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '1px solid #eee' }} />
                </a>
              </div>
              {proof.order && (
                <div className="mt-3">
                  {proof.order.isPaid ? (
                    <span className="text-green-700 font-semibold">Order Approved</span>
                  ) : (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={async () => {
                        const token = localStorage.getItem('token');
                        await fetch(`/api/orders/${proof.order._id}/approve`, {
                          method: 'PUT',
                          headers: { Authorization: token ? `Bearer ${token}` : '' }
                        });
                        // Reload proofs
                        setLoading(true);
                        fetch('/api/payment-proofs', {
                          headers: { Authorization: token ? `Bearer ${token}` : '' }
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
                      }}
                    >
                      Approve Order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentProofs;
