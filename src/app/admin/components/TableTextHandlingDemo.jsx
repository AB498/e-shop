'use client';

import { useState } from 'react';
import Table from '@/components/ui/table';

export default function TableTextHandlingDemo() {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data with long text content
  const data = [
    {
      id: 1,
      code: 'PROD-12345-XYZ',
      name: 'Smartphone X Pro',
      description: 'The latest smartphone with advanced features including a high-resolution camera, long-lasting battery, and powerful processor.',
      specs: 'Display: 6.7" AMOLED, Processor: Octa-core 2.8GHz, RAM: 8GB, Storage: 256GB, Battery: 5000mAh',
      notes: 'This product has been our best seller for three consecutive months. Customer feedback has been overwhelmingly positive.',
    },
    {
      id: 2,
      code: 'PROD-67890-ABC',
      name: 'Wireless Earbuds',
      description: 'Premium wireless earbuds with noise cancellation, water resistance, and up to 24 hours of battery life with the charging case.',
      specs: 'Bluetooth 5.2, Noise Cancellation, IPX7 Water Resistance, Battery: 6 hours (earbuds) + 18 hours (case)',
      notes: 'New color variants will be available next month. Consider bundling with smartphones for promotional offers.',
    },
    {
      id: 3,
      code: 'PROD-54321-DEF',
      name: 'Ultra HD Smart TV',
      description: 'A stunning 65-inch smart TV with 4K resolution, HDR support, and built-in streaming apps for the ultimate entertainment experience.',
      specs: '65" 4K UHD, HDR10+, Refresh Rate: 120Hz, Smart TV OS, HDMI ports: 4, USB ports: 2, Wi-Fi, Bluetooth',
      notes: 'Extended warranty program has been popular with this model. Supply chain issues resolved as of last week.',
    },
    {
      id: 4,
      code: 'PROD-09876-GHI',
      name: 'Ergonomic Office Chair',
      description: 'A comfortable and adjustable office chair designed for long hours of work, featuring lumbar support and breathable mesh material.',
      specs: 'Weight Capacity: 300lbs, Adjustable Height: 17-21", Recline: 90-135°, 360° Swivel, Armrest: Adjustable',
      notes: 'Corporate bulk orders have increased by 30% this quarter. Consider special pricing for orders over 10 units.',
    },
    {
      id: 5,
      code: 'PROD-13579-JKL',
      name: 'Professional Blender',
      description: 'High-performance blender with multiple speed settings and preset programs for smoothies, soups, and more.',
      specs: 'Power: 1200W, Capacity: 64oz, Speed Settings: 10, Preset Programs: 5, Dishwasher Safe Parts',
      notes: 'Seasonal promotion planned for summer. Social media campaign with healthy recipes in preparation.',
    },
  ];

  // Table columns with different text handling options
  const columns = [
    { 
      key: 'id', 
      label: 'ID',
      maxWidth: '60px',
      noWrap: true
    },
    { 
      key: 'code', 
      label: 'Product Code',
      maxWidth: '150px',
      noWrap: true // Text stays on one line (may cause horizontal overflow)
    },
    { 
      key: 'name', 
      label: 'Product Name',
      maxWidth: '180px',
      truncate: true // Truncate with ellipsis and show full text on hover
    },
    { 
      key: 'description', 
      label: 'Description',
      maxWidth: '250px'
      // Default behavior - text will wrap naturally
    },
    { 
      key: 'specs', 
      label: 'Specifications',
      maxWidth: '200px',
      truncate: true // Truncate with ellipsis
    },
    { 
      key: 'notes', 
      label: 'Notes',
      maxWidth: '180px'
      // Default behavior - text will wrap naturally
    },
    {
      key: 'actions',
      label: 'Actions',
      maxWidth: '120px',
      render: (row) => (
        <div className="flex space-x-2">
          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
          <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Table Text Handling Demo</h1>
        <p className="mt-2 text-gray-600">
          This demo showcases different text handling options for table cells:
        </p>
        <ul className="mt-2 list-disc pl-5 text-gray-600">
          <li>ID and Product Code: No wrapping (whitespace-nowrap)</li>
          <li>Product Name and Specs: Truncation with ellipsis and tooltip</li>
          <li>Description and Notes: Natural text wrapping</li>
          <li>All columns have max-width constraints</li>
        </ul>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Table
          data={data}
          columns={columns}
          title="Products with Text Handling Options"
          isLoading={isLoading}
          enableSorting={true}
          enablePagination={true}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pageSize: 5,
          }}
        />
      </div>
    </div>
  );
}
