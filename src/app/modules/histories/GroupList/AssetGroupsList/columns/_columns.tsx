import { Column } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../constants/Common";
import { Group } from "../../../api/_models";
import { GroupCustomHeader } from "./GroupCustomHeader";

const groupColumns: ReadonlyArray<Column<Group>> = [
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="" className="min-w-20px" />,
    accessor: "checkbox",
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="" className="min-w-20px" />,
    accessor: "tree",
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Name" className="min-w-150px" />,
    accessor: "name",
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Description" className="min-w-100px" />,
    accessor: "description",
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Metadata" className="min-w-100px" />,
    accessor: "metadata",
    Cell: ({ value }) => {
      if (!value || typeof value !== "object") {
        return <span className="text-muted"></span>;
      }
      return (
        <div>
          {Object.entries(value).map(([key, val], index) => (
            <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
              {`${key}: ${val}`}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Created At" className="min-w-70px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Status" className="min-w-30px" />,
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
];

export { groupColumns };
