"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import ModalOne from "@/TailAdminComponents/Modals/ModalOne";
import ModalTwo from "@/TailAdminComponents/Modals/ModalTwo";
import ModalThree from "@/TailAdminComponents/Modals/ModalThree";

const Modals: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Modals" />

      <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap justify-center gap-5">
          <ModalOne />
          <ModalTwo />
          <ModalThree />
        </div>
      </div>
    </>
  );
};

export default Modals;
