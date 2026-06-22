import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import FlagshipProduct from '@/sections/products/FlagshipProduct';
import ProductShowcase from '@/sections/products/ProductShowcase';
import CTABanner from '@/sections/home/CTABanner';
import ProductsScene from '@/components/products/ProductsScene';
import { PageContainer } from '@/components/ui/Containers';

export const metadata: Metadata = { 
  title: 'Products',
  description: 'Explore the digital platforms engineered by VANIKARA INTELLIGENCE PRIVATE LIMITED, including our flagship Student Marketplace.'
};

/**
 * ProductsPage: Showcases internal and external products built by Vanikara.
 * Features a Flagship product reveal and a showcase of upcoming platforms.
 */
export default function ProductsPage() {
  return (
    <PageContainer>
      <ProductsScene />
      <PageHero
        tag="Our Products"
        title={<>Products Designed for <span className="gradient-text">Real Impact</span></>}
        subtitle="Platforms that solve genuine problems for students, businesses, and communities."
      />
      <FlagshipProduct />
      <ProductShowcase />
      <CTABanner
        title="Interested in Our Products?"
        subtitle="Get a personalised demo of the Student Marketplace Platform."
        primaryLabel="Request a Demo"
        primaryHref="/contact"
      />
    </PageContainer>
  );
}
