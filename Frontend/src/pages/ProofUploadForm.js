import React, { useState } from 'react';
import API_BASE_URL from '../api';

const ProofUploadForm = ({ defaultName = '', defaultEmail = '', productId }) => {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !screenshot) {
      setError('Name, email, and screenshot are required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('screenshot', screenshot);
    if (productId) formData.append('product', productId);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment-proofs`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setSuccess('Payment proof uploaded! We will confirm your payment soon.');
      setName(defaultName);
      setEmail(defaultEmail);
      setMessage('');
      setScreenshot(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        className="w-full border px-3 py-2 rounded"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        className="w-full border px-3 py-2 rounded"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        placeholder="Message (optional)"
        className="w-full border px-3 py-2 rounded"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={e => setScreenshot(e.target.files[0])}
        required
      />
      {loading ? (
        <button className="w-full bg-gray-400 text-white py-2 rounded" disabled>Uploading...</button>
      ) : (
        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800" type="submit">Submit Proof</button>
      )}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
};

export default ProofUploadForm;
