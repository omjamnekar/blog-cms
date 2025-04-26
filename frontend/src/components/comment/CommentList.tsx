import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, updateComment, deleteComment } from '../../api/comments';
import { useAuth } from '../../context/AuthContext';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import { CommentCreateData, CommentUpdateData } from '../../types';
import Loader from '../ui/Loader';

interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, formState: { errors: errorsCreate } } = useForm<CommentCreateData>();
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate, setValue, formState: { errors: errorsUpdate } } = useForm<CommentUpdateData>();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const { isAuthenticated, token, user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });
  
  const createCommentMutation = useMutation({
    mutationFn: (data: CommentCreateData) => createComment(token || '', postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment added successfully');
      resetCreate();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
  
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: CommentUpdateData }) => 
      updateComment(token || '', postId, commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment updated successfully');
      setEditingCommentId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update comment');
    },
  });
  
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(token || '', postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });
  
  const onCreateSubmit = (data: CommentCreateData) => {
    if (!data.user && user?.username) {
      data.user = user.username;
    }
    createCommentMutation.mutate(data);
  };
  
  const onUpdateSubmit = (data: CommentUpdateData) => {
    if (editingCommentId) {
      updateCommentMutation.mutate({ commentId: editingCommentId, data });
    }
  };
  
  const startEditing = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setValue('content', content);
  };
  
  const cancelEditing = () => {
    setEditingCommentId(null);
    resetUpdate();
  };
  
  const handleDelete = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">{comments?.length || 0} Comments</h3>
      
      {isAuthenticated && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4">
            {!user?.username && (
              <div>
                <label htmlFor="user" className="form-label">Your Name</label>
                <input
                  id="user"
                  type="text"
                  className="form-input"
                  {...registerCreate('user', { required: 'Name is required' })}
                />
                {errorsCreate.user && (
                  <p className="form-error">{errorsCreate.user.message}</p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="content" className="form-label">Comment</label>
              <textarea
                id="content"
                rows={3}
                className="form-input"
                placeholder="Share your thoughts..."
                {...registerCreate('content', { required: 'Comment content is required' })}
              />
              {errorsCreate.content && (
                <p className="form-error">{errorsCreate.content.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createCommentMutation.isPending}
              >
                {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-4">
        {comments?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments?.map(comment => (
            <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {comment.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{comment.user}</p>
                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                {isAuthenticated && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(comment.id, comment.content)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label="Edit comment"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-400 hover:text-error-600 transition-colors"
                      aria-label="Delete comment"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {editingCommentId === comment.id ? (
                <form onSubmit={handleSubmitUpdate(onUpdateSubmit)} className="mt-3 space-y-3">
                  <textarea
                    rows={3}
                    className="form-input"
                    {...registerUpdate('content', { required: 'Comment content is required' })}
                  />
                  {errorsUpdate.content && (
                    <p className="form-error">{errorsUpdate.content.message}</p>
                  )}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateCommentMutation.isPending}
                    >
                      {updateCommentMutation.isPending ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-3 text-gray-700">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;