const axios = require('axios');

const baseURL = 'https://ngm-adaeze-shop.onrender.com/api';

async function testAPI() {
  try {
    console.log('Testing GET /products');
    const productsRes = await axios.get(`${baseURL}/products`);
    console.log('Products response status:', productsRes.status);
    console.log('Products data sample:', productsRes.data.length ? productsRes.data[0] : 'No products');

    console.log('Testing POST /users/login with invalid credentials');
    try {
      await axios.post(`${baseURL}/users/login`, {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    } catch (err) {
      console.log('Login error status:', err.response ? err.response.status : err.message);
      console.log('Login error message:', err.response ? err.response.data.message : err.message);
    }

    console.log('Testing POST /users/register with missing fields');
    try {
      await axios.post(`${baseURL}/users/register`, {
        email: 'testuser@example.com'
        // missing password and name
      });
    } catch (err) {
      console.log('Register error status:', err.response ? err.response.status : err.message);
      console.log('Register error message:', err.response ? err.response.data.message : err.message);
    }

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();
