import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import TableOne from "@/TailAdminComponents/Tables/TableOne";
import TableThree from "@/TailAdminComponents/Tables/TableThree";
import TableTwo from "@/TailAdminComponents/Tables/TableTwo";

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
  );
};

export default TablesPage;
