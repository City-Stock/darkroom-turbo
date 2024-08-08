import React from "react";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import NotificationsOne from "@/TailAdminComponents/Notifications/NotificationsOne";
import NotificationsTwo from "@/TailAdminComponents/Notifications/NotificationsTwo";
import NotificationsThree from "@/TailAdminComponents/Notifications/NotificationsThree";

const Notifications: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Notifications" />

      <div className="flex flex-col gap-7.5">
        <NotificationsOne />
        <NotificationsTwo />
        <NotificationsThree />
      </div>
    </>
  );
};

export default Notifications;
