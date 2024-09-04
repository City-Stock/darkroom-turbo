import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="p-4 sm:p-6 xl:p-7.5">
        <nav>
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                className={`flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
                href="#"
                onClick={handlePrevious}
              >
                Previous
              </Link>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <Link
                  className={`flex items-center justify-center rounded py-1.5 px-3 font-medium hover:bg-primary hover:text-white ${
                    currentPage === index + 1 ? "bg-primary text-white" : ""
                  }`}
                  href="#"
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className={`flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
                href="#"
                onClick={handleNext}
              >
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
