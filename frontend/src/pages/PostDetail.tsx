import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import CommentList from '../components/comment/CommentList';
import Loader from '../components/ui/Loader';
import { formatDate } from '../utils/formatters';
import { motion } from 'framer-motion';

const PostDetail = () => {
  const { postId = '' } = useParams();
  const { token } = useAuth();
  
  const { data: post, isLoading } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPostById(token || '', postId),
    enabled: !!token && !!postId,
  });
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
        <p className="text-gray-600">The post you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const defaultImage = 'https://images.pexels.com/photos/3944425/pexels-photo-3944425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img 
            src={post.imagePath || defaultImage} 
            alt={post.title} 
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center">
                <span className="text-primary-800 font-medium">
                  {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="ml-2">
                {post.author?.username || 'Unknown'}
              </span>
            </div>
            <span className="flex items-center">
              Published on {formatDate(post.createdAt)}
            </span>
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map(category => (
                  <span key={category.id} className="badge badge-primary">
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <CommentList postId={post.id} />
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetail;