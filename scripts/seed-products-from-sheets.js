// Script to fetch products from Google Sheets data
import fetch from 'node-fetch';

// Google Sheets configuration
const SPREADSHEET_ID = '1uLRjFuiv_xfZgUEZ3kNx69-4Tg2kGpTpwB3FjNiRNHE';

// Function to fetch data from Google Sheets using the public CSV export
async function fetchSheetsData() {
  try {
    // Use the CSV export URL which doesn't require authentication
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=tsv`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const tsvText = await response.text();

    // Parse TSV data (tab-separated values to avoid comma issues)
    const rows = tsvText.split('\n').map(row => row.split('\t'));

    console.log(`Fetched ${rows.length} rows from Google Sheets`);
    return rows;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

// Function to process the sheet data into product objects
function processProductData(rows) {
  // Skip the header row (first row)
  const dataRows = rows.slice(1);

  // Map rows to product objects
  return dataRows.map((row, index) => {
    // Based on the spreadsheet structure: Name, Price, Description, Image URL, Group Photo URL
    if (row.length < 4) {
      console.log(`Skipping row ${index + 1} due to insufficient data:`, row);
      return null;
    }

    const name = row[0];
    const price = row[1];
    const description = row[2];
    const imageUrl = row[3];
    const groupPhotoUrl = row[4]; // Extract Group Photo URL (column E)

    // Default to Grooming category (ID: 1)
    const categoryName = 'Grooming';

    // Generate a unique SKU based on category and index
    const categoryPrefix = categoryName.substring(0, 3).toUpperCase();
    const sku = `${categoryPrefix}-SHEET-${(index + 1).toString().padStart(2, '0')}`;

    // Set a reasonable price (between 9.99 and 29.99)
    let productPrice = 9.99;
    if (price && !isNaN(parseFloat(price)) && parseFloat(price) < 100) {
      productPrice = parseFloat(price);
    } else {
      // Generate a random price between 9.99 and 29.99
      productPrice = Math.round((9.99 + Math.random() * 20) * 100) / 100;
    }

    return {
      // Start with ID 1 for Google Sheets products
      id: index + 1,
      name: name || 'Unnamed Product',
      sku,
      category_id: getCategoryIdByName(categoryName),
      price: productPrice,
      stock: parseInt('10'),
      weight: 0.5,
      description: description || 'No description available',
      image: imageUrl || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60',
      groupPhotoUrl: groupPhotoUrl || '', // Add Group Photo URL to the product object
    };
  }).filter(product => product !== null);
}

// Function to get category ID by name
function getCategoryIdByName(categoryName) {
  // Map category names to IDs based on our seed data
  const categoryMap = {
    'Grooming': 1,
    'Hair Care': 2,
    'Health and Beauty': 3,
    'Hot Offers': 4,
    'Kids and Baby': 5,
    'Makeup': 6,
    'Perfume': 7,
    'Top Brands': 8
  };

  return categoryMap[categoryName] || 1; // Default to category 1 if not found
}

// Function to generate product images data
function generateProductImagesData(products) {
  const productImages = [];

  products.forEach(product => {
    // Create primary image
    productImages.push({
      product_id: product.id,
      url: product.image,
      key: `products/${product.id}-image-0`,
      alt_text: `${product.name} main image`,
      position: 0,
      is_primary: true
    });

    // If Group Photo URL exists, use it as the second image instead of generating variants
    if (product.groupPhotoUrl) {
      productImages.push({
        product_id: product.id,
        url: product.groupPhotoUrl,
        key: `products/${product.id}-image-1`,
        alt_text: `${product.name} group photo`,
        position: 1,
        is_primary: false
      });
    } else {
      // If no Group Photo URL, create variant images with different parameters (legacy behavior)
      productImages.push({
        product_id: product.id,
        url: `${product.image}&sat=-30`,
        key: `products/${product.id}-image-1`,
        alt_text: `${product.name} variant 1`,
        position: 1,
        is_primary: false
      });

      productImages.push({
        product_id: product.id,
        url: `${product.image}&blur=10`,
        key: `products/${product.id}-image-2`,
        alt_text: `${product.name} variant 2`,
        position: 2,
        is_primary: false
      });
    }
  });

  return productImages;
}

// Main function to get products from Google Sheets
export async function getProductsFromSheets() {
  try {
    console.log('Fetching products from Google Sheets...');

    // Fetch data from Google Sheets
    const rows = await fetchSheetsData();
    console.log(`Fetched ${rows.length - 1} products from Google Sheets`);

    // Process the data into product objects
    const productData = processProductData(rows);
    console.log(`Processed ${productData.length} products from Google Sheets`);

    // Generate product images data
    const productImagesData = generateProductImagesData(productData);
    console.log(`Generated ${productImagesData.length} product images for Google Sheets products`);

    return {
      products: productData,
      productImages: productImagesData
    };

  } catch (error) {
    console.error('Error fetching products from Google Sheets:', error);
    // Return empty arrays as fallback
    return {
      products: [],
      productImages: []
    };
  }
}

// For standalone execution
if (process.argv[1] === import.meta.url) {
  console.log('Starting script execution...');
  getProductsFromSheets().then(data => {
    console.log(`Fetched ${data.products.length} products and ${data.productImages.length} images from Google Sheets`);
    console.log('First product:', data.products[0]);

    // Check if Group Photo URLs are being used
    const productsWithGroupPhotos = data.products.filter(p => p.groupPhotoUrl).length;
    console.log(`Products with Group Photo URLs: ${productsWithGroupPhotos} out of ${data.products.length}`);

    // Check the first product's images
    if (data.products.length > 0) {
      const firstProductId = data.products[0].id;
      const firstProductImages = data.productImages.filter(img => img.product_id === firstProductId);
      console.log('First product images:', firstProductImages);
    }
  }).catch(error => {
    console.error('Error in main execution:', error);
  });
} else {
  console.log('Script imported as a module, not executing standalone code');
}
