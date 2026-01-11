import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.images[0]);
        setSelectedSize(res.data.sizes[0]);
        setSelectedColor(res.data.colors[0]);
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
    navigate('/cart');
  };

  if (!product) return <div className="container mx-auto py-12">Loading...</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <div className="mb-4 overflow-hidden rounded-xl">
            <motion.img 
              key={mainImage}
              src={mainImage}
              alt={product.name}
              className="w-full h-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`border-2 rounded-lg overflow-hidden ${
                  mainImage === image ? 'border-primary-500' : 'border-neutral-200'
                }`}
              >
                <img src={image} alt={`${product.name} ${index}`} className="w-full h-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <span className="text-primary-600 font-medium">{product.category}</span>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <p className="text-2xl font-bold mt-4">${product.price}</p>
          </div>

          <p className="text-neutral-700 mb-8">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color 
                      ? 'border-black ring-2 ring-primary-500' 
                      : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedSize === size
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center border border-neutral-300 rounded-lg w-32">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-xl"
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-xl"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-colors flex-1"
            >
              Add to Cart
            </button>
            <button className="border border-neutral-300 font-semibold py-3 px-8 rounded-lg hover:bg-neutral-50 transition-colors flex-1">
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-16 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: product.details }} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
