import { useState, useMemo } from "react";

export function useTableSort<T>(initialData: T[]) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return initialData;
    return [...initialData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [initialData, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) =>
      prev?.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" }
    );
  };

  return { sortConfig, sortedData, handleSort };
}
