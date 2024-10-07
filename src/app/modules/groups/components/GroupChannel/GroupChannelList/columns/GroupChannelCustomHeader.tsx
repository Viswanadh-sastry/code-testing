import { FC, PropsWithChildren } from "react";
import { HeaderProps } from "react-table";
import { GroupChannel } from "../../../../api/_models";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<GroupChannel>>;
};
const GroupChannelCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  return (
    <th {...tableProps.column.getHeaderProps()} className={className} key={tableProps.column.id}>
      {title}
    </th>
  );
};

export { GroupChannelCustomHeader };
