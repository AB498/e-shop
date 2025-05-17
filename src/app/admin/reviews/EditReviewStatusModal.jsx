'use client';

import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function EditReviewStatusModal({ review, onClose, onSubmit }) {
  const [status, setStatus] = useState(review.status || 'pending');
  const cancelButtonRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(status);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Ensure rating is a number
  const rating = typeof review.rating === 'number'
    ? review.rating
    : parseFloat(review.rating || 0);

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <form onSubmit={handleSubmit}>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Manage Review Status
                  </Dialog.Title>

                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Review Details</h4>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Product:</span>
                          <span className="text-sm font-medium text-gray-900">{review.productName || 'Unknown Product'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Customer:</span>
                          <span className="text-sm font-medium text-gray-900">{review.userName || 'Unknown User'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Date:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Rating:</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              i < Math.floor(rating) ? (
                                <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
                              ) : (
                                <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                              )
                            ))}
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Review Content</h4>
                      {review.title ? (
                        <p className="mt-1 text-sm font-medium text-gray-900">{review.title}</p>
                      ) : (
                        <p className="mt-1 text-sm italic text-gray-500">No title provided</p>
                      )}
                      {review.reviewText ? (
                        <p className="mt-1 text-sm text-gray-600">{review.reviewText}</p>
                      ) : (
                        <p className="mt-1 text-sm italic text-gray-500">No review text provided</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Review Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                      onClick={onClose}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
