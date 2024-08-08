"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import AccordionOne from "@/TailAdminComponents/Accordions/AccordionOne";
import AccordionTwo from "@/TailAdminComponents/Accordions/AccordionTwo";

const Accordion: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Accordion" />

      <div className="flex flex-col gap-7.5">
        <AccordionOne />
        <AccordionTwo />
      </div>
    </>
  );
};

export default Accordion;
