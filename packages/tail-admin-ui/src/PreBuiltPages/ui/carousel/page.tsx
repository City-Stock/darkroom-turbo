"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import CarouselTwo from "@/TailAdminComponents/Carousels/CarouselTwo";
import CarouselOne from "@/TailAdminComponents/Carousels/CarouselOne";
import CarouselThree from "@/TailAdminComponents/Carousels/CarouselThree";

const Carousel: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Carousel" />

      <div className="flex flex-col gap-7.5">
        <CarouselOne />
        <CarouselTwo />
        <CarouselThree />
      </div>
    </>
  );
};

export default Carousel;
