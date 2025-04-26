import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, deleteCategory } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Loader from '../ui/Loader';

interface CategoryFormData {
  name: string;
}

const CategoryManager = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
  
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory(token || '', name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
  
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(token || '', categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      setSelectedCategoryId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
  
  const onSubmit = (data: CategoryFormData) => {
    createCategoryMutation.mutate(data.name);
  };
  
  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">Category Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="E.g., Technology, Health, Travel"
              {...register('name', { required: 'Category name is required' })}
            />
            {errors.name && (
              <p className="form-error">{errors.name.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Categories</h3>
        {categories?.length === 0 ? (
          <p className="text-gray-500">No categories found. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {categories?.map(category => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-3 rounded-md ${
                  selectedCategoryId === category.id ? 'bg-primary-50' : 'bg-gray-50'
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <span className="font-medium text-gray-800">{category.name}</span>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-gray-400 hover:text-error-600 transition-colors"
                  aria-label={`Delete ${category.name} category`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;