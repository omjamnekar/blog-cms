import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/blog/PostCard';
import Loader from '../components/ui/Loader';
import { motion } from 'framer-motion';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { token } = useAuth();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(token || ''),
    enabled: !!token,
  });
  
  if (isLoading) {
    return <Loader />;
  }
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Dashboard</h2>
          <Link to="/create-post" className="btn btn-primary inline-flex items-center">
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create New Post
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Posts</h3>
        
        {posts?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h4>
              <p className="text-gray-600 mb-6">Create your first blog post to get started.</p>
              <Link to="/create-post" className="btn btn-primary">
                Create Your First Post
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;