import { motion } from 'framer-motion';
import CategoryManager from '../components/category/CategoryManager';

const Categories = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Categories</h2>
          <CategoryManager />
        </div>
      </motion.div>
    </div>
  );
};

export default Categories;