import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../components/AdminLayout';
import AdminPaymentProofs from '../components/AdminPaymentProofs';
import API_BASE_URL from '../api';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
    image: null,
    sizes: [],
  });
  const [addSuccess, setAddSuccess] = useState('');
  const [addError, setAddError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(responseData => {
        // Handle the new response structure with data nesting
        const data = responseData.data || responseData;
        setProducts(data.products || []);
      })
      .catch(err => {
        setAddError('Failed to fetch products');
      });
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    setAddLoading(true);
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('brand', newProduct.brand);
    formData.append('category', newProduct.category);
    formData.append('description', newProduct.description);
    formData.append('price', parseFloat(newProduct.price));
    formData.append('countInStock', parseInt(newProduct.countInStock));
    if (newProduct.sizes.length > 0) {
      formData.append('sizes', newProduct.sizes.join(','));
    }
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(responseData => {
        // Handle the new response structure with data nesting
        const data = responseData.data || responseData;
        setProducts([...products, data]);
        setNewProduct({
          name: '',
          brand: '',
          category: '',
          description: '',
          price: '',
          countInStock: '',
          image: null,
          sizes: [],
        });
        setImagePreview(null);
        setAddSuccess('Product added successfully!');
        setAddLoading(false);
      })
      .catch(err => {
        setAddError(err.message || 'Failed to add product');
        setAddLoading(false);
      });
  };

  const handleDelete = (id) => {
    setDeleteLoading(id);
    fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(() => {
        setProducts(products.filter(p => p._id !== id));
        setDeleteLoading(null);
      })
      .catch(err => {
        setDeleteLoading(null);
        setAddError('Failed to delete product');
      });
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Panel | Your E-commerce Store</title>
        <meta name="description" content="Admin dashboard for managing products, orders, and users in Your E-commerce Store." />
        <meta name="keywords" content="admin, dashboard, ecommerce, products, orders, management" />
        <meta property="og:title" content="Admin Panel | Your E-commerce Store" />
        <meta property="og:description" content="Admin dashboard for managing products, orders, and users in Your E-commerce Store." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/admin" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Admin Panel | Your E-commerce Store" />
        <meta name="twitter:description" content="Admin dashboard for managing products, orders, and users in Your E-commerce Store." />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage products, orders, and payment proofs</p>
        </div>
        <AdminPaymentProofs />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
                <p className="text-gray-600">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">0</h3>
                <p className="text-gray-600">Pending Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">0</h3>
                <p className="text-gray-600">Payment Proofs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        <form onSubmit={handleAddProduct} className="bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-4 sm:p-8 shadow-lg mb-8 w-full flex flex-col gap-4">
          <label className="font-semibold">Product Name</label>
          <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full p-2 rounded" required />

          <label className="font-semibold">Brand</label>
          <input type="text" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full p-2 rounded" required />

          <label className="font-semibold">Category</label>
          <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full p-2 rounded" required>
            <option value="">Select Category</option>
            <option value="clothes">Clothes</option>
            <option value="shoes">Shoes</option>
            <option value="phone">Shorts</option>
            <option value="electronics">Electronics</option>
            <option value="other">Other</option>
          </select>

          <label className="font-semibold">Description</label>
          <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full p-2 rounded" rows={3} required />

          <label className="font-semibold">Price</label>
          <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full p-2 rounded" required />

          <label className="font-semibold">Count in Stock</label>
          <input type="number" value={newProduct.countInStock} onChange={e => setNewProduct({ ...newProduct, countInStock: e.target.value })} className="w-full p-2 rounded" required />

          {/* Display Sizes if Category is Clothes or Shoes */}
          {(newProduct.category === 'clothes' || newProduct.category === 'shoes') && (
            <>
              <label className="font-semibold">Sizes</label>
              <select multiple value={newProduct.sizes} onChange={e => { const values = Array.from(e.target.selectedOptions, option => option.value); setNewProduct({ ...newProduct, sizes: values }); }} className="w-full p-2 rounded" required>
                <option value="L">L</option>
                <option value="M">M</option>
                <option value="S">S</option>
              </select>
            </>
          )}

          <label className="font-semibold">Product Image</label>
          <input type="file" accept="image/*" onChange={e => {
            const file = e.target.files[0];
            setNewProduct({ ...newProduct, image: file });
            setImagePreview(URL.createObjectURL(file));
          }} className="w-full p-2 rounded" required />

          {addError && <div className="text-red-500">{addError}</div>}
          {addSuccess && <div className="text-green-500">{addSuccess}</div>}
          {imagePreview && <div><img src={imagePreview} alt="Preview" className="w-20 h-20" /></div>}

          <button type="submit" className="bg-blue-700 text-white p-2 rounded mt-4" disabled={addLoading}>
            {addLoading ? 'Adding...' : 'Add Product'}
          </button>
        </form>

        {/* Product List */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Brand</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">In Stock</th>
                <th className="py-2 px-4">Sizes</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td className="py-2 px-4"><img src={product.image} alt={product.name ? `Image of ${product.name}` : 'Product image'} className="w-16 h-16 object-cover rounded" /></td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.brand}</td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">₦{product.price}</td>
                  <td className="py-2 px-4">{product.countInStock}</td>
                  <td className="py-2 px-4">{product.sizes.join(', ')}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button className="bg-yellow-400 text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-600 text-white px-4 py-2 rounded" disabled={deleteLoading === product._id}>
                      {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPanel;
