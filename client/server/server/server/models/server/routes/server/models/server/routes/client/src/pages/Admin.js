import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Admin = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    details: '',
    price: '',
    category: '',
    sizes: '',
    colors: ''
  });
  
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    videoUrl: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        const [productsRes, bannersRes, ordersRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/banners'),
          axios.get('/api/orders')
        ]);
        
        setProducts(productsRes.data);
        setBanners(bannersRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(productForm).forEach(([key, value]) => {
        if (key === 'sizes' || key === 'colors') {
          formData.append(key, value.split(',').map(item => item.trim()));
        } else {
          formData.append(key, value);
        }
      });
      
      // Add files
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const res = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setProducts([...products, res.data]);
      setProductForm({
        name: '',
        description: '',
        details: '',
        price: '',
        category: '',
        sizes: '',
        colors: ''
      });
      setSelectedFiles([]);
      alert('Product created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(bannerForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add image file (assuming first selected file is the banner image)
      if (selectedFiles.length > 0) {
        formData.append('image', selectedFiles[0]);
      }
      
      const res = await axios.post('/api/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setBanners([...banners, res.data]);
      setBannerForm({
        title: '',
        subtitle: '',
        videoUrl: ''
      });
      setSelectedFiles([]);
      alert('Banner created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating banner');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p className="mb-6">Please log in to access the admin panel.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={logout}
          className="text-neutral-600 hover:text-neutral-900"
        >
          Logout
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'products' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-neutral-600'}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'banners' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-neutral-600'}`}
          onClick={() => setActiveTab('banners')}
        >
          Banners
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-neutral-600'}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleProductSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Details (HTML)</label>
                <textarea
                  value={productForm.details}
                  onChange={(e) => setProductForm({...productForm, details: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({...productForm, sizes: e.target.value})}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                    placeholder="S, M, L, XL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                    placeholder="Black, White, Blue"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                  className="w-full"
                  accept="image/*"
                  required
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2 text-sm">
                    Selected {selectedFiles.length} file(s)
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>
          
          {/* Product List */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">All Products</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {products.map(product => (
                <div key={product._id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{product.name}</h3>
                    <span className="text-primary-600 font-bold">${product.price}</span>
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {product.category} • {product.sizes.join(', ')}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-sm text-primary-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-sm text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Banner Form */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Add New Banner</h2>
            <form onSubmit={handleBannerSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
                <input
                  type="text"
                  value={bannerForm.videoUrl}
                  onChange={(e) => setBannerForm({...bannerForm, videoUrl: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Banner Image</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFiles([e.target.files[0]])}
                  className="w-full"
                  accept="image/*"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Banner'}
              </button>
            </form>
          </div>
          
          {/* Banner List */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">All Banners</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {banners.map(banner => (
                <div key={banner._id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{banner.title}</h3>
                    <span className="text-sm">
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{banner.subtitle}</p>
                  {banner.videoUrl && (
                    <p className="text-xs text-neutral-500 mt-1">Has video</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button className="text-sm text-primary-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-sm text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">All Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="py-3">{order._id.substring(0, 8)}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 font-bold">${order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-sm text-primary-600 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
