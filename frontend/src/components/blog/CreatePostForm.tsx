import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { PostCreateData } from '../../types';

const CreatePostForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PostCreateData>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const createPostMutation = useMutation({
    mutationFn: (data: PostCreateData) => createPost(token || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create post');
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: PostCreateData) => {
    if (!user?._id) {
      toast.error('User not authenticated');
      return;
    }

    const formData = {
      ...data,
      authorId: user._id,
    };
    
    if (selectedImage) {
      formData.image = selectedImage;
    }
    
    createPostMutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="form-label">Title</label>
        <input
          id="title"
          type="text"
          className="form-input"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="form-error">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content" className="form-label">Content</label>
        <textarea
          id="content"
          rows={6}
          className="form-input"
          {...register('content', { required: 'Content is required' })}
        />
        {errors.content && (
          <p className="form-error">{errors.content.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="image" className="form-label">Featured Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className="form-input"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-40 w-auto rounded-md object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;