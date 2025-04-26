import { motion } from 'framer-motion';
import PostList from '../components/blog/PostList';

const Home = () => {
  return (
    <div className="space-y-8">
      <motion.div 
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BlogCMS</h1>
        <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto">
          A place to discover interesting articles and share your thoughts
        </p>
      </motion.div>
      
      <PostList />
    </div>
  );
};

export default Home;