import { FC } from "react";

type Props = {
  message?: string;
  color: "primary" | "secondary" | "danger" | "white";
};

const LoadingSpinner: FC<Props> = ({ message, color }) => {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="w-6 h-6 rounded-full animate-spin border-y-2 border-solid border-blue-500 border-t-transparent shadow-md"></div>
      <div className={`text-${color}`}>{message}</div>
    </div>
  );
};

export default LoadingSpinner;
