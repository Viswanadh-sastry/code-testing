import { Column } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../../constants/Common";
import { ThingChannel } from "../../../../api/_models";
import { ChannelActionsCell } from "./ChannelActionsCell";
import { ChannelCustomHeader } from "./ChannelCustomHeader";
import { ChannelMessagingCell } from "./ChannelMessagingCell";

const userColumns: ReadonlyArray<Column<ThingChannel>> = [
  {
    Header: (props) => <ChannelCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <ChannelCustomHeader tableProps={props} title="Description" className="min-w-125px" />,
    accessor: "description",
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
    Header: (props) => <ChannelCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <ChannelCustomHeader tableProps={props} title="Messaging" className="min-w-20px" />,
    accessor: "id",
    Cell: ({ value }) => <ChannelMessagingCell id={value} />,
  },
  {
    Header: (props) => <ChannelCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <ChannelActionsCell id={props.data[props.row.index].id} />,
  },
];

export { userColumns };
