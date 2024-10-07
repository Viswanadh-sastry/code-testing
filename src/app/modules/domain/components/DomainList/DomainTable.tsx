import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTable, ColumnInstance, Row } from "react-table";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { usersColumns } from "./columns/_columns";
import { Domain } from "../../api/_models";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { DomainListPagination } from "./pagination/DomainListPagination";
import { DomainListLoading } from "./pagination/DomainListLoading";
import { DomainListHeader } from "./DomainListHeader";
import { AddDomain } from "../AddDomain/AddDomain";
import { getDomainList } from "../../api/DomainAPI";
import { ImportDomain } from "../AddDomain/ImportDomain/ImportDomain";

const DomainTable = () => {
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [filterDomain, setFilterDomain] = useState({
    offset: 0,
    limit: 10,
    name: "",
    permission: "",
    status: "enabled",
  });
  const domainListQuery = useQuery({
    queryKey: [`domainListQuery`, filterDomain],
    queryFn: async () => getDomainList(filterDomain).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const isLoading = domainListQuery.isLoading;
  const data = useMemo(() => domainListQuery.data?.domains || [], [domainListQuery.data]);
  const columns = useMemo(() => usersColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddDomain = () => {
    setShowAddDomain(true);
  };

  const onCloseAddDomain = () => {
    setShowAddDomain(false);
  };

  const onGetDomainList = () => {
    domainListQuery.refetch();
  };

  const onShowImportDomain = () => setImportModal(true);
  const onCloseImportDomain = () => setImportModal(false);

  return (
    <KTCard>
      <DomainListHeader onShowAddDomain={onShowAddDomain} setFilterDomain={setFilterDomain} onShowImportDomain={onShowImportDomain} filterDomain={filterDomain} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_users" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Domain>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Domain>, i) => {
                  prepareRow(row);
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="d-flex text-center w-100 align-content-center justify-content-center">No matching records found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <DomainListPagination filterDomain={filterDomain} setFilterDomain={setFilterDomain} />
        {showAddDomain && <AddDomain onCloseAddDomain={onCloseAddDomain} onGetDomainList={onGetDomainList} />}
        {importModal && <ImportDomain onShowImportDomain={importModal} onCloseImportDomain={onCloseImportDomain} onGetDomainList={onGetDomainList} />}
        {isLoading && <DomainListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DomainTable };
