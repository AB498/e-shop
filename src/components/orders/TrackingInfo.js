'use client';

import React from 'react';

export default function TrackingInfo({ tracking, trackingError, isRefreshing, refreshTracking, payment_method, hasTrackingId }) {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-3">
        <h2 className="text-base font-semibold text-[#253D4E]">Tracking Information</h2>
        <div className="mt-2 md:mt-0">
          <button
            onClick={refreshTracking}
            className="bg-[#006B51] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#005541] transition-colors flex items-center"
            disabled={isRefreshing}
            title="Refresh tracking information without altering tracking history"
          >
            {isRefreshing ? (
              <span className="inline-block mr-1 h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
            Refresh
          </button>
        </div>
      </div>

      {trackingError ? (
        <div className="bg-red-50 p-3 rounded-md text-red-800 mb-3 text-xs">
          <p>{trackingError}</p>
        </div>
      ) : payment_method === 'cod' && !hasTrackingId ? (
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <div className="flex justify-center mb-3">
            <div className="animate-pulse bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Courier being assigned
            </div>
          </div>
          <p className="text-[#7E7E7E] text-xs mb-2">
            Your Cash on Delivery order is being processed. A courier will be assigned soon.
          </p>
          <p className="text-[#7E7E7E] text-xs">
            Tracking information will be available once a courier is assigned to your order.
          </p>
          <button
            onClick={refreshTracking}
            className="mt-3 bg-[#006B51] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#005541] transition-colors"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Checking status...' : 'Check status'}
          </button>
        </div>
      ) : !tracking ? (
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p className="text-[#7E7E7E] text-xs mb-2">Loading tracking information...</p>
          <div className="flex justify-center mt-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#006B51]"></div>
          </div>
        </div>
      ) : !tracking?.has_tracking ? (
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p className="text-[#7E7E7E] text-xs mb-2">This order doesn't have tracking information yet.</p>
          <p className="text-[#7E7E7E] text-xs">Please check back later or try refreshing.</p>
          <button
            onClick={refreshTracking}
            className="mt-3 bg-[#006B51] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#005541] transition-colors"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Tracking'}
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-[#7E7E7E] text-xs">Courier</p>
                <p className="font-medium text-xs">{tracking.courier?.name || 'Unknown'}</p>
              </div>
              <div className="mb-2 md:mb-0">
                <p className="text-[#7E7E7E] text-xs">Tracking Number</p>
                <p className="font-medium text-xs">{tracking.tracking_id}</p>
              </div>
              <div>
                <p className="text-[#7E7E7E] text-xs">Status</p>
                <p className={`font-medium text-xs ${
                  tracking.current_status === 'Delivered' ? 'text-green-600' :
                  tracking.current_status === 'Cancelled' || tracking.current_status === 'Returned' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {tracking.current_status}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-[#253D4E] mb-2">Tracking History</h3>

          {tracking.tracking.length === 0 ? (
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-[#7E7E7E] text-xs">No tracking updates available yet.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-2 top-4 bottom-4 w-0.5 bg-gray-200"></div>

              {/* Timeline events */}
              <div className="space-y-4">
                {tracking.tracking.map((event, index) => (
                  <div key={event.id} className="flex items-start">
                    <div className={`relative flex items-center justify-center w-4 h-4 rounded-full mt-1 mr-3 ${
                      index === 0 ? 'bg-[#006B51]' : 'bg-gray-300'
                    }`}>
                      <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <h3 className={`font-medium text-xs ${index === 0 ? 'text-[#006B51]' : 'text-gray-700'}`}>
                          {event.status}
                        </h3>
                        <span className="text-xs text-gray-500">{event.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{event.details}</p>
                      {event.location && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          <span className="inline-block mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          </span>
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
