import ProductDetail from '@/components/products/ProductDetail';
import { getProductById } from '@/lib/actions/products';

// Enable static generation for better performance
export const dynamic = 'auto';
export const revalidate = 3600; // Revalidate every hour

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
        ? product.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
        : `Discover ${product.name || 'our products'} at Thai Bangla Store.`;

      // Add key product attributes to description for better SEO
      const attributeParts = [];

      if (product.brand && product.brand !== 'Thai Bangla Store') {
        attributeParts.push(`Brand: ${product.brand}`);
      }

      if (product.type) {
        attributeParts.push(`Type: ${product.type}`);
      }

      if (product.originCountry) {
        attributeParts.push(`Origin: ${product.originCountry}`);
      }

      if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
        attributeParts.push(`Available in: ${product.sizes.slice(0, 3).join(', ')}`);
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

    // Safely calculate discount price if applicable
    let discountPrice, hasDiscount;
    try {
      discountPrice = product.discountPrice || product.price;
      hasDiscount = product.discountPercentage > 0;
    } catch (error) {
      console.error('Error calculating discount:', error);
      discountPrice = product.price;
      hasDiscount = false;
    }

    // Safely generate keywords based on product attributes including new fields
    let keywords;
    try {
      const baseKeywords = [
        product.name,
        product.category,
        product.brand, // NEW: Include brand
        product.type, // NEW: Include product type
        product.material, // NEW: Include material
        product.originCountry, // NEW: Include origin country
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

      // Add tags if available
      const productTags = product.tags && Array.isArray(product.tags) ? product.tags : [];

      // Add sizes if available
      const productSizes = product.sizes && Array.isArray(product.sizes) ? product.sizes : [];

      // Add colors if available
      const productColors = product.colors && Array.isArray(product.colors) ? product.colors : [];

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

      // Add brand if different from store name
      if (product.brand && product.brand !== 'Thai Bangla Store') {
        seoTitle = `${seoTitle} by ${product.brand}`;
      }

      // Add product type for better categorization
      if (product.type) {
        seoTitle = `${seoTitle} - ${product.type}`;
      }

      // Add origin country for premium positioning
      if (product.originCountry && product.originCountry !== 'Bangladesh') {
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
        // Create structured data for this product
        const additionalProperties = [];

        if (product.material) {
          additionalProperties.push({
            '@type': 'PropertyValue',
            name: 'Material',
            value: product.material
          });
        }

        if (product.originCountry) {
          additionalProperties.push({
            '@type': 'PropertyValue',
            name: 'Country of Origin',
            value: product.originCountry
          });
        }

        if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
          additionalProperties.push({
            '@type': 'PropertyValue',
            name: 'Available Sizes',
            value: product.sizes.join(', ')
          });
        }

        if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
          additionalProperties.push({
            '@type': 'PropertyValue',
            name: 'Available Colors',
            value: product.colors.join(', ')
          });
        }

        const discountPrice = product.discountPrice || product.price;
        const hasDiscount = product.discountPercentage > 0;

        structuredData = {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: product.name,
          description: product.description?.replace(/<[^>]*>/g, '').replace(/\n/g, ' ') || `Discover ${product.name} at Thai Bangla Store`,
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
