import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../api/posts';
import { getCategories } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import PostCard from './PostCard';
import Loader from '../ui/Loader';

const PostList = () => {
  const { token } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', selectedCategory],
    queryFn: () => getPosts(token || '', selectedCategory),
    enabled: !!token,
  });
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
  
  const handleCategoryFilter = (categoryName?: string) => {
    setSelectedCategory(categoryName);
  };
  
  if (postsLoading || categoriesLoading) {
    return <Loader />;
  }
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter(undefined)}
            className={`btn ${
              !selectedCategory ? 'btn-primary' : 'btn-outline'
            }`}
          >
            All
          </button>
          {categories?.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.name)}
              className={`btn ${
                selectedCategory === category.name ? 'btn-primary' : 'btn-outline'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {posts?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No posts found.</h3>
          <p className="text-gray-500 mt-2">Try a different category or create a new post.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;