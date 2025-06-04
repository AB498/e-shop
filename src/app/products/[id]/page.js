import ProductDetail from '@/components/products/ProductDetail';
import { getProductById } from '@/lib/actions/products';
import { slateValueToText } from '@/components/ui/slate/SlateUtils';

// Enable static generation for better performance
export const dynamic = 'auto';
export const revalidate = 3600; // Revalidate every hour

// Helper function to extract plain text from rich text descriptions
const getPlainTextDescription = (description) => {
  if (!description) return '';

  // If it's already plain text, return as is
  if (typeof description === 'string') {
    try {
      // Try to parse as JSON (rich text format)
      const parsed = JSON.parse(description);
      if (Array.isArray(parsed)) {
        // It's rich text, convert to plain text
        return slateValueToText(parsed);
      }
      // If parsing succeeds but it's not an array, treat as plain text
      return description;
    } catch {
      // If JSON parsing fails, it's plain text
      return description;
    }
  }

  // If it's already an array (rich text format), convert to plain text
  if (Array.isArray(description)) {
    return slateValueToText(description);
  }

  // Fallback to string conversion
  return String(description);
};

// Generate static params for popular products (improves initial load time)
export async function generateStaticParams() {
  try {
    // Pre-generate pages for the first 50 products (most popular/recent)
    const staticParams = [];
    for (let i = 1; i <= 50; i++) {
      staticParams.push({ id: i.toString() });
    }
    return staticParams;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  // Default metadata in case of errors
  const defaultMetadata = {
    title: 'Product - Thai Bangla Store',
    description: 'Discover premium Thai products at Thai Bangla Store.',
    openGraph: {
      title: 'Product - Thai Bangla Store',
      description: 'Discover premium Thai products at Thai Bangla Store.',
      type: 'website',
      url: 'https://thaibanglastore.com/products',
      siteName: 'Thai Bangla Store',
      images: [
        {
          url: '/images/logo.png',
          width: 800,
          height: 600,
          alt: 'Thai Bangla Store Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product - Thai Bangla Store',
      description: 'Discover premium Thai products at Thai Bangla Store.',
      images: ['/images/logo.png'],
    },
  };

  // Safely parse the ID parameter
  let productId;
  try {
    productId = parseInt(params?.id);
    if (isNaN(productId)) {
      console.error('Invalid product ID:', params?.id);
      return defaultMetadata;
    }
  } catch (error) {
    console.error('Error parsing product ID:', error);
    return defaultMetadata;
  }

  try {
    // Fetch complete product data for metadata using the existing action
    const product = await getProductById(productId);

    if (!product) {
      return {
        title: 'Product Not Found - Thai Bangla Store',
        description: 'The requested product could not be found.',
        openGraph: {
          title: 'Product Not Found - Thai Bangla Store',
          description: 'The requested product could not be found.',
          type: 'website',
          url: `https://thaibanglastore.com/products/${productId}`,
          siteName: 'Thai Bangla Store',
          images: [
            {
              url: '/images/logo.png',
              width: 800,
              height: 600,
              alt: 'Thai Bangla Store Logo',
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Product Not Found - Thai Bangla Store',
          description: 'The requested product could not be found.',
          images: ['/images/logo.png'],
        },
      };
    }

    // Safely create a clean description without HTML tags, enhanced with product attributes
    let cleanDescription;
    try {
      let baseDescription = product.description
        ? getPlainTextDescription(product.description).replace(/\n/g, ' ')
        : `Discover ${product.name || 'our products'} at Thai Bangla Store.`;

      // Helper function to check if value is valid (not null, undefined, empty, or "N/A")
      const isValidValue = (value) => {
        return value &&
               value !== 'N/A' &&
               value !== 'n/a' &&
               value.trim() !== '' &&
               value.toLowerCase() !== 'null' &&
               value.toLowerCase() !== 'undefined';
      };

      // Add key product attributes to description for better SEO
      const attributeParts = [];

      if (isValidValue(product.brand) && product.brand !== 'Thai Bangla Store') {
        attributeParts.push(`Brand: ${product.brand}`);
      }

      if (isValidValue(product.type)) {
        attributeParts.push(`Type: ${product.type}`);
      }

      if (isValidValue(product.originCountry)) {
        attributeParts.push(`Origin: ${product.originCountry}`);
      }

      if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
        // Filter out N/A values from sizes array
        const validSizes = product.sizes.filter(size => isValidValue(size));
        if (validSizes.length > 0) {
          attributeParts.push(`Available in: ${validSizes.slice(0, 3).join(', ')}`);
        }
      }

      // Combine base description with attributes
      if (attributeParts.length > 0) {
        cleanDescription = `${baseDescription} ${attributeParts.join(' | ')}. Premium quality products delivered to your doorstep.`;
      } else {
        cleanDescription = `${baseDescription} Premium quality Thai products delivered to your doorstep.`;
      }
    } catch (error) {
      console.error('Error cleaning description:', error);
      cleanDescription = `Discover our products at Thai Bangla Store. Premium quality Thai products delivered to your doorstep.`;
    }

    // Calculate discount info for keywords
    let hasDiscount;
    try {
      hasDiscount = product.discountPercentage > 0;
    } catch (error) {
      console.error('Error calculating discount:', error);
      hasDiscount = false;
    }

    // Safely generate keywords based on product attributes including new fields
    let keywords;
    try {
      // Helper function to check if value is valid (not null, undefined, empty, or "N/A")
      const isValidKeyword = (value) => {
        return value &&
               value !== 'N/A' &&
               value !== 'n/a' &&
               value.trim() !== '' &&
               value.toLowerCase() !== 'null' &&
               value.toLowerCase() !== 'undefined';
      };

      const baseKeywords = [
        product.name,
        product.category,
        isValidKeyword(product.brand) ? product.brand : null, // Filter N/A
        isValidKeyword(product.type) ? product.type : null, // Filter N/A
        isValidKeyword(product.material) ? product.material : null, // Filter N/A
        isValidKeyword(product.originCountry) ? product.originCountry : null, // Filter N/A
        'Thai products',
        'Bangladesh',
        'beauty products',
        'health products',
        'Thai Bangla Store',
        product.sku,
        hasDiscount ? 'discount' : '',
        hasDiscount ? 'sale' : '',
        'online shopping',
        'premium products',
        'Thai beauty',
        'imported products'
      ];

      // Add tags if available and filter out N/A values
      const productTags = product.tags && Array.isArray(product.tags)
        ? product.tags.filter(tag => isValidKeyword(tag))
        : [];

      // Add sizes if available and filter out N/A values
      const productSizes = product.sizes && Array.isArray(product.sizes)
        ? product.sizes.filter(size => isValidKeyword(size))
        : [];

      // Add colors if available and filter out N/A values
      const productColors = product.colors && Array.isArray(product.colors)
        ? product.colors.filter(color => isValidKeyword(color))
        : [];

      keywords = [
        ...baseKeywords,
        ...productTags,
        ...productSizes,
        ...productColors
      ].filter(Boolean).join(', ');
    } catch (error) {
      console.error('Error generating keywords:', error);
      keywords = 'Thai products, Bangladesh, beauty products, health products, Thai Bangla Store, online shopping';
    }



    try {
      // Create SEO-optimized title with key product attributes
      let seoTitle = product.name || 'Product';

      // Helper function to check if value is valid (not null, undefined, empty, or "N/A")
      const isValidValue = (value) => {
        return value &&
               value !== 'N/A' &&
               value !== 'n/a' &&
               value.trim() !== '' &&
               value.toLowerCase() !== 'null' &&
               value.toLowerCase() !== 'undefined';
      };

      // Add brand if different from store name and valid
      if (isValidValue(product.brand) && product.brand !== 'Thai Bangla Store') {
        seoTitle = `${seoTitle} by ${product.brand}`;
      }

      // Add product type for better categorization if valid
      if (isValidValue(product.type)) {
        seoTitle = `${seoTitle} - ${product.type}`;
      }

      // Add origin country for premium positioning if valid
      if (isValidValue(product.originCountry) && product.originCountry !== 'Bangladesh') {
        seoTitle = `${seoTitle} from ${product.originCountry}`;
      }

      // Add store name
      seoTitle = `${seoTitle} | Thai Bangla Store`;

      // Ensure title is not too long (recommended max 60 characters for SEO)
      if (seoTitle.length > 60) {
        seoTitle = `${product.name} - ${product.type || 'Premium Product'} | Thai Bangla Store`;
      }

      return {
        title: seoTitle,
        description: cleanDescription.substring(0, 160), // Limit description to 160 characters for SEO
        keywords: keywords,

        // Open Graph metadata with enhanced product information
        openGraph: {
          title: `${product.name || 'Product'} - Thai Bangla Store`,
          description: cleanDescription.substring(0, 200),
          type: 'website', // Using 'website' as the safe standard type
          url: `https://thaibanglastore.com/products/${productId}`,
          siteName: 'Thai Bangla Store',
          locale: 'en_US',
          images: [
            {
              url: product.image || '/images/logo.png',
              width: 800,
              height: 600,
              alt: product.name || 'Product Image',
            },
          ],
        },

        // Twitter card metadata
        twitter: {
          card: 'summary_large_image',
          title: `${product.name || 'Product'} - Thai Bangla Store`,
          description: cleanDescription.substring(0, 200),
          images: [product.image || '/images/logo.png'],
        },


      };
    } catch (error) {
      console.error('Error creating final metadata:', error);
      return defaultMetadata;
    }
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return defaultMetadata;
  }
}

// This is a Server Component that fetches data
export default async function ProductDetailPage(props) {
  const params = await props.params;
  await params;
  const { id } = params;

  // Fetch product data for structured data
  let structuredData = null;
  try {
    const productId = parseInt(id);
    if (!isNaN(productId)) {
      const product = await getProductById(productId);
      if (product) {
        // Helper function to check if value is valid (not null, undefined, empty, or "N/A")
        const isValidStructuredValue = (value) => {
          return value &&
                 value !== 'N/A' &&
                 value !== 'n/a' &&
                 value.trim() !== '' &&
                 value.toLowerCase() !== 'null' &&
                 value.toLowerCase() !== 'undefined';
        };

        // Create structured data for this product
        const additionalProperties = [];

        if (isValidStructuredValue(product.material)) {
          additionalProperties.push({
            '@type': 'PropertyValue',
            name: 'Material',
            value: product.material
          });
        }

        if (isValidStructuredValue(product.originCountry)) {
          additionalProperties.push({
            '@type': 'PropertyValue',
            name: 'Country of Origin',
            value: product.originCountry
          });
        }

        if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
          const validSizes = product.sizes.filter(size => isValidStructuredValue(size));
          if (validSizes.length > 0) {
            additionalProperties.push({
              '@type': 'PropertyValue',
              name: 'Available Sizes',
              value: validSizes.join(', ')
            });
          }
        }

        if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
          const validColors = product.colors.filter(color => isValidStructuredValue(color));
          if (validColors.length > 0) {
            additionalProperties.push({
              '@type': 'PropertyValue',
              name: 'Available Colors',
              value: validColors.join(', ')
            });
          }
        }

        const discountPrice = product.discountPrice || product.price;
        const hasDiscount = product.discountPercentage > 0;

        structuredData = {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: product.name,
          description: product.description ? getPlainTextDescription(product.description).replace(/\n/g, ' ') : `Discover ${product.name} at Thai Bangla Store`,
          image: product.image || '/images/logo.png',
          sku: product.sku || `product-${productId}`,
          mpn: product.sku || `product-${productId}`,
          category: product.category || 'Beauty & Health',
          brand: {
            '@type': 'Brand',
            name: product.brand || 'Thai Bangla Store'
          },
          manufacturer: {
            '@type': 'Organization',
            name: product.brand || 'Thai Bangla Store'
          },
          ...(additionalProperties.length > 0 && { additionalProperty: additionalProperties }),
          ...(product.tags && Array.isArray(product.tags) && product.tags.length > 0 && {
            keywords: product.tags.join(', ')
          }),
          offers: {
            '@type': 'Offer',
            url: `https://thai-bangla-store.vercel.app/products/${productId}`,
            priceCurrency: 'BDT',
            price: hasDiscount ? discountPrice : product.price,
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            itemCondition: 'https://schema.org/NewCondition',
            availability: (product.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'Thai Bangla Store'
            }
          }
        };
      }
    }
  } catch (error) {
    console.error('Error creating structured data for page:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Inject structured data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <ProductDetail productId={id} />
    </div>
  );
}
