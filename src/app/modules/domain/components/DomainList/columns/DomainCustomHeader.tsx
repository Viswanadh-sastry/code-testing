import { FC, PropsWithChildren } from "react";
import { HeaderProps } from "react-table";
import { Domain } from "../../../api/_models";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<Domain>>;
};
const DomainCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  return (
    <th {...tableProps.column.getHeaderProps()} className={className} key={tableProps.column.id}>
      {title}
    </th>
  );
};

export { DomainCustomHeader };
