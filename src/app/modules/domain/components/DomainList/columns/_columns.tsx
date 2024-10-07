import { Column } from "react-table";
import { UserActionsCell } from "./DomainActionsCell";
import { DomainCustomHeader } from "./DomainCustomHeader";
import { Domain } from "../../../api/_models";

const usersColumns: ReadonlyArray<Column<Domain>> = [
  {
    Header: (props) => <DomainCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <DomainCustomHeader tableProps={props} title="Tags" className="min-w-125px" />,
    accessor: "tags",
    Cell: ({ value }) => (
      <>
        {value?.map((tag: string, index: number) => (
          <div key={index} className="badge badge-light-primary fw-bolder me-2">
            {tag}
          </div>
        ))}
      </>
    ),
  },
  {
    Header: (props) => <DomainCustomHeader tableProps={props} title="Role" className="min-w-125px" />,
    accessor: "permission",
  },
  {
    Header: (props) => <DomainCustomHeader tableProps={props} title="Alias" className="min-w-125px" />,
    accessor: "alias",
  },
  {
    Header: (props) => <DomainCustomHeader tableProps={props} title="Status" className="min-w-125px" />,
    accessor: "status",
    Cell: ({ ...props }) => (
      <>
        {props.data[props.row.index].status === "enabled" ? (
          <div className="badge badge-light-success fw-bolder">enabled</div>
        ) : (
          <div className="badge badge-light-danger fw-bolder">disabled</div>
        )}
      </>
    ),
  },
  {
    Header: (props) => <DomainCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => (
      <UserActionsCell domainId={props.data[props.row.index].id} domainName={props.data[props.row.index].name} permission={props.data[props.row.index].permission} />
    ),
  },
];

export { usersColumns };
