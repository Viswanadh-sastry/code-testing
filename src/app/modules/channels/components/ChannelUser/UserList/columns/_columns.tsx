import { Column } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../../constants/Common";
import { ChannelUser } from "../../../../api/_models";
import { UserActionsCell } from "./UserActionsCell";
import { UserCustomHeader } from "./UserCustomHeader";

const userColumns: ReadonlyArray<Column<ChannelUser>> = [
  {
    Header: (props) => <UserCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title="Metadata" className="min-w-125px" />,
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
    Header: (props) => <UserCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} relation={props.data[props.row.index].relation} />,
  },
];

export { userColumns };
