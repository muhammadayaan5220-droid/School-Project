import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <motion.div
          key={product._id}
          layout
          whileHover={{ y: -10 }}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
        >
          <Link to={`/product/${product._id}`}>
            <div className="relative pb-[100%]">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-neutral-600 text-sm mb-2">{product.category}</p>
              <p className="font-bold text-lg">${product.price}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
