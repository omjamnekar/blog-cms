import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { formatDate } from '../../utils/formatters';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const defaultImage = 'https://images.pexels.com/photos/3944425/pexels-photo-3944425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="card overflow-hidden"
    >
      <Link to={`/posts/${post.id}`}>
        <img 
          src={post.imagePath || defaultImage} 
          alt={post.title} 
          className="h-48 w-full object-cover"
        />
      </Link>
      <div className="p-5">
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">{post.title}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
              <span className="text-primary-800 font-medium">
                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {post.author?.username || 'Unknown'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
        {post.categories && post.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map(category => (
              <span key={category.id} className="badge badge-primary">
                {category.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;