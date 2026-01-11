import { motion } from 'framer-motion';

const HeroBanner = ({ banner }) => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${banner.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white px-4 max-w-3xl"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            whileHover={{ scale: 1.03 }}
          >
            {banner.title}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {banner.subtitle}
          </motion.p>
          <motion.button
            className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-full text-lg hover:bg-neutral-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
