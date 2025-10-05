import Hero from "@/components/sections/Hero";
import FeaturedRooms from "@/components/sections/FeaturedRooms";
import Gallery from "@/components/sections/Gallery";
import QuickLinks from "@/components/sections/QuickLinks";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedRooms />
      <Gallery />
      <QuickLinks />
      <Testimonials />
    </>
  );
}
