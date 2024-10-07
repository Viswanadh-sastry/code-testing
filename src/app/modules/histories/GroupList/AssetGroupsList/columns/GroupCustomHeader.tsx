import { FC, PropsWithChildren, useEffect, useState } from "react";
import { HeaderProps } from "react-table";
import { Group } from "../../../api/_models";
import { useSelectedValues } from "../../../HistoryContext";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<Group>>;
};

const GroupCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  const { selectedValues, setSelectedValues } = useSelectedValues();
  const [isChecked, setIsChecked] = useState(false);
  const [allIds, setAllIds] = useState<string[]>([]);

  const isCheckboxHeader = tableProps.column.id === "checkbox";

  // Updated function to accept readonly array
  const collectIds = (groups: readonly Group[]): string[] => {
    let ids: string[] = [];

    groups.forEach((group) => {
      if (group.id) ids.push(group.id);
      if (group.children && group.children.length > 0) {
        ids = ids.concat(collectIds(group.children));
      }
    });

    return ids;
  };

  useEffect(() => {
    // Collect all IDs for the current page
    const ids = collectIds(tableProps.data);
    setAllIds(ids);

    // Check if all IDs are selected
    const allSelected = ids.every((id) => selectedValues.includes(id));
    setIsChecked(allSelected);
  }, [tableProps.data, selectedValues]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);

    setSelectedValues((prevSelected: string[]) => {
      if (checked) {
        // Add all current page items (including children) to the selected list
        return Array.from(new Set([...prevSelected, ...allIds]));
      } else {
        // Remove all current page items (including children) from the selected list
        return prevSelected.filter((id) => !allIds.includes(id));
      }
    });
  };

  return (
    <th {...tableProps.column.getHeaderProps()} className={className} key={tableProps.column.id}>
      {isCheckboxHeader ? (
        <div className="form-check form-check-custom form-check-solid mx-5">
          <input className="form-check-input" type="checkbox" checked={isChecked} onChange={(e) => handleCheckboxChange(e.target.checked)} />
        </div>
      ) : (
        title
      )}
    </th>
  );
};

export { GroupCustomHeader };
