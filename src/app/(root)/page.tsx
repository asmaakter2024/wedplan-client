import Banner from "@/components/shared/Banner";
import FeaturedServices from "@/components/home/FeaturedServices";
import ServiceCategories from "@/components/home/ServiceCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
      <HowItWorks />
    </>
  );
}
