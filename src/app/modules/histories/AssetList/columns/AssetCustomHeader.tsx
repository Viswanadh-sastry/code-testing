import { FC, PropsWithChildren } from "react";
import { HeaderProps } from "react-table";
import { History } from "../../api/_models";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<History>>;
};
const AssetCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  return (
    <th {...tableProps.column.getHeaderProps()} className={className} key={tableProps.column.id}>
      {title}
    </th>
  );
};

export { AssetCustomHeader };
