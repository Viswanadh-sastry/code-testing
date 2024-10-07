import { Column } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../../constants/Common";
import { ChannelGroup } from "../../../../api/_models";
import { GroupActionsCell } from "./GroupActionsCell";
import { GroupCustomHeader } from "./GroupCustomHeader";

const groupColumns: ReadonlyArray<Column<ChannelGroup>> = [
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Description" className="min-w-125px" />,
    accessor: "description",
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Metadata" className="min-w-125px" />,
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
    Header: (props) => <GroupCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <GroupCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <GroupActionsCell id={props.data[props.row.index].id} />,
  },
];

export { groupColumns };
