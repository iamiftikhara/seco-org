import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Programs from './components/Programs';
import Impact from './components/Impact';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Testimonials from './components/Testimonials';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Services />
        <Programs />
        <Impact />
        <Events />
        <Gallery />
        <Blog />
        <Testimonials />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
