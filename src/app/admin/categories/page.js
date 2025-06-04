'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import CategoriesTable from './CategoriesTable';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new category
  const handleAddCategory = async (categoryData) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add category');
      }

      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  // Handle editing a category
  const handleEditCategory = async (categoryId, categoryData) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }

      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (category) => {
    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle moving a category up in order
  const handleMoveUp = async (category) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'move_up',
          id: category.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reorder category');
      }

      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error moving category up:', err);
      setError(err.message || 'Failed to reorder category');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle moving a category down in order
  const handleMoveDown = async (category) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'move_down',
          id: category.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reorder category');
      }

      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error moving category down:', err);
      setError(err.message || 'Failed to reorder category');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle normalizing category order
  const handleNormalizeOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'normalize',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to normalize category order');
      }

      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error normalizing category order:', err);
      setError(err.message || 'Failed to normalize category order');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    (category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (category.slug && category.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Categories"
        onAddClick={() => setShowAddModal(true)}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Search and Refresh */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full sm:w-auto sm:flex-1">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleNormalizeOrder}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            title="Fix category order to ensure sequential numbering"
          >
            Normalize Order
          </button>
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <CategoriesTable
        categories={filteredCategories}
        onEdit={(category) => {
          setCurrentCategory(category);
          setShowEditModal(true);
        }}
        onDelete={handleDeleteCategory}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        isLoading={isLoading}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCategory}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditCategory}
        category={currentCategory}
      />
    </div>
  );
}
