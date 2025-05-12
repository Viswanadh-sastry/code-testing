import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getHistoryList } from "../../../histories/api/HistoryAPI";
import { getThingList } from "../../api/ThingAPI";
import { getThingChannelList } from "../../api/ThingChannelAPI";
import { Thing } from "../../api/_models";
import { AddThing } from "../AddEditThing/AddThing";
import { ImportThings } from "../AddEditThing/ImportThings/ImportThings";
import { ThingsListHeader } from "./ThingsListHeader";
import { CustomRow } from "./columns/CustomRow";
import { thingsColumns } from "./columns/_columns";
import { ThingsListLoading } from "./pagination/ThingsListLoading";
import { ThingsListPagination } from "./pagination/ThingsListPagination";

const ThingsTable = () => {
  const [showAddThing, setShowAddThing] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filterChannel = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  };
  const [filterThing, setFilterThing] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  });

  const onShowImportThing = () => setImportModal(true);
  const onCloseImportThing = () => setImportModal(false);

  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () =>
      getThingList(filterThing)
        .then(async (response) => {
          const things = await Promise.all(
            response.things.map(async (thing: any) => {
              try {
                const channel = await getThingChannelList(thing.id, filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                return {
                  ...thing,
                  isConnected: channel.total > 0,
                };
              } catch (error) {
                return {
                  ...thing,
                  isConnected: false,
                };
              }
            })
          );
          return { ...response, things };
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = thingListQuery.isLoading;
  const rawData = useMemo(() => thingListQuery.data?.things || [], [thingListQuery.data]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return rawData;
    return [...rawData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [rawData, sortConfig]);

  const columns = useMemo(() => thingsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data: sortedData,
  });

  const handleSort = (key: string) => {
    if (!key) return;
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const onShowAddThing = () => setShowAddThing(true);
  const onCloseAddThing = () => setShowAddThing(false);
  const onGetThingList = () => thingListQuery.refetch();

  return (
    <KTCard>
      <ThingsListHeader onShowAddThing={onShowAddThing} onShowImportThing={onShowImportThing} setFilterThing={setFilterThing} filterThing={filterThing} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_things" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
          <thead>
  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
    {headers.map((column: ColumnInstance<Thing>) => (
      <th
        {...column.getHeaderProps()}
        style={{ cursor: "pointer" }}
        onClick={() => handleSort(column.id)}
      >
        {column.render("Header")}
        {sortConfig?.key === column.id && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
      </th>
    ))}
  </tr>
</thead>

            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Thing>, i) => {
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
        <ThingsListPagination filterThing={filterThing} setFilterThing={setFilterThing} />
        {showAddThing && <AddThing onCloseAddThing={onCloseAddThing} onGetThingList={onGetThingList} />}
        {importModal && <ImportThings onShowImportThing={importModal} onCloseImportThing={onCloseImportThing} onGetThingList={onGetThingList} />}
        {isLoading && <ThingsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { ThingsTable };
