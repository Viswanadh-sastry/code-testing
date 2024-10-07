import { useMemo } from "react";
import clsx from "clsx";

interface IDeviceListPaginationProps {
  deviceHistoryListQuery: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
}

const DeviceListPagination = ({ deviceHistoryListQuery, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage }: IDeviceListPaginationProps) => {
  const totalItems = deviceHistoryListQuery.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || deviceHistoryListQuery.isLoading) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const paginationLinks = useMemo(() => {
    const links = [];
    links.push({ label: "Previous", page: currentPage > 1 ? currentPage - 1 : null });

    for (let i = 1; i <= totalPages; i++) {
      links.push({ label: i.toString(), page: i });
    }

    links.push({ label: "Next", page: currentPage < totalPages ? currentPage + 1 : null });
    return links;
  }, [currentPage, totalPages]);

  return (
    <div className="row">
      <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start py-7">
        <select className="form-select form-select-solid w-90px ps-8 me-2" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
        <div id="kt_table_channels_info" className="dataTables_info">
          {deviceHistoryListQuery.isLoading ? "Loading..." : `Total ${totalItems} histories`}
        </div>
      </div>
      <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
        <div id="kt_table_channels_paginate">
          <ul className="pagination">
            {paginationLinks.map((link, index) => (
              <li
                key={index}
                className={clsx("page-item", {
                  active: currentPage === link.page,
                  disabled: !link.page,
                  previous: link.label === "Previous",
                  next: link.label === "Next",
                })}
              >
                <a className="page-link" onClick={() => handlePageChange(link.page!)} style={{ cursor: link.page ? "pointer" : "not-allowed" }}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { DeviceListPagination };
