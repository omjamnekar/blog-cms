import { motion } from 'framer-motion';
import CreatePostForm from '../components/blog/CreatePostForm';

const CreatePost = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog Post</h2>
          <CreatePostForm />
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePost;