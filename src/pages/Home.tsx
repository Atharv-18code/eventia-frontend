import About from '@/components/About';
import Contact from '@/components/Contact';
import Events from '@/components/Events';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Events />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
