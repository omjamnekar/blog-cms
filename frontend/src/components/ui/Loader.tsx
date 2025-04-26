import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-t-primary-500 border-r-primary-300 border-b-primary-100 border-l-gray-200"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;