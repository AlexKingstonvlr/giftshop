import Hero from '../components/Hero';
import Featured from '../components/Featured';
import Stats from '../components/Stats';
import CraftShowcase from '../components/CraftShowcase';
import ProductsGrid from '../components/ProductsGrid';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import CustomOrder from '../components/CustomOrder';
import { type Product, type TestimonialItem } from '../data/products';

interface HomeProps {
  products: Product[];
  testimonials: TestimonialItem[];
}

export default function Home({ products, testimonials }: HomeProps) {
  return (
    <>
      <Hero />
      <Featured />
      <Stats />
      <CraftShowcase />
      <ProductsGrid products={products} />
      <Process />
      <Testimonials testimonials={testimonials} />
      <CustomOrder />
    </>
  );
}
