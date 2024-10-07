import { FC, PropsWithChildren } from "react";
import { HeaderProps } from "react-table";
import { Channels } from "../../../api/_models";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<Channels>>;
};
const ChannelsCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  return (
    <th {...tableProps.column.getHeaderProps()} className={className} key={tableProps.column.id}>
      {title}
    </th>
  );
};

export { ChannelsCustomHeader };
