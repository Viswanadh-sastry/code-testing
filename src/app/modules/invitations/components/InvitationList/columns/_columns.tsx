import { Column } from "react-table";
import { InvitationActionsCell } from "./InvitationActionsCell";
import { InvitationCustomHeader } from "./InvitationCustomHeader";
import { Invitation } from "../../../api/_models";

const invitationsColumns: ReadonlyArray<Column<Invitation>> = [
  {
    Header: (props) => <InvitationCustomHeader tableProps={props} title="Invitation" className="min-w-125px" />,
    accessor: "invited_by",
    Cell: ({ ...props }) => (
      <span>
        You have invited <div className="badge badge-dark">{props.data[props.row.index].toUserName}</div> from the user{" "}
        <div className="badge badge-dark">{props.data[props.row.index].fromUserName}</div> to join the organization{" "}
        <div className="badge badge-primary">{props.data[props.row.index].domainName}</div> with the relation{" "}
        <div className="badge badge-secondary">{props.data[props.row.index].relation}</div>
      </span>
    ),
  },
  {
    Header: (props) => <InvitationCustomHeader tableProps={props} title="Actions" className="text-end min-w-200px" />,
    id: "actions",
    Cell: ({ ...props }) => <InvitationActionsCell userId={props.data[props.row.index].user_id} domainId={props.data[props.row.index].domain_id} />,
  },
];

export { invitationsColumns };
