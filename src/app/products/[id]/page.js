import ProductDetail from '@/components/products/ProductDetail';
import { getProductById } from '@/lib/actions/products';

export const dynamic = 'force-dynamic';

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
  let { _ } = await params;
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

    // Safely create a clean description without HTML tags
    let cleanDescription;
    try {
      cleanDescription = product.description
        ? product.description.replace(/<[^>]*>/g, '')
        : `Discover ${product.name || 'our products'} at Thai Bangla Store. Premium quality Thai products delivered to your doorstep.`;
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

    // Safely generate keywords based on product attributes
    let keywords;
    try {
      keywords = [
        product.name,
        product.category,
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
      ].filter(Boolean).join(', ');
    } catch (error) {
      console.error('Error generating keywords:', error);
      keywords = 'Thai products, Bangladesh, beauty products, health products, Thai Bangla Store, online shopping';
    }

    // Safely create structured data for product (JSON-LD)
    let structuredData;
    try {
      structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name || 'Thai Product',
        description: cleanDescription,
        image: product.image || '/images/logo.png',
        sku: product.sku || `product-${productId}`,
        mpn: product.sku || `product-${productId}`,
        brand: {
          '@type': 'Brand',
          name: 'Thai Bangla Store'
        },
        offers: {
          '@type': 'Offer',
          url: `https://thaibanglastore.com/products/${productId}`,
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
    } catch (error) {
      console.error('Error creating structured data:', error);
      structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: 'Thai Product',
        description: 'Premium Thai product from Thai Bangla Store',
        image: '/images/logo.png',
        brand: {
          '@type': 'Brand',
          name: 'Thai Bangla Store'
        }
      };
    }

    try {
      return {
        title: `${product.name || 'Product'} - Thai Bangla Store`,
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

        // Structured data for rich results in search engines
        other: {
          'application/ld+json': JSON.stringify(structuredData),
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

  return (
    <div className="min-h-screen flex flex-col">

      <ProductDetail productId={id} />

    </div>
  );
}
