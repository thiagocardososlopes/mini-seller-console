import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Edit,
  Delete,
  Visibility,
  Settings,
  ArrowDropUp,
  ArrowDropDown,
  MoreVert,
} from "@mui/icons-material";

type Option = {
  label: string;
  value: string | number | boolean;
};

export type Column<T> = {
  label: string;
  key: keyof T;
  options?: Option[];
  type?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowHover?: (row: T | null) => void;
  onRowDoubleClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onConfig?: (row: T) => void;
  onView?: (row: T) => void;
};

type SortState<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;

const DropdownPortal = ({ children, dropdownRef }: { children: React.ReactNode, dropdownRef: React.RefObject<HTMLDivElement> }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div ref={dropdownRef}>{children}</div>,
    document.body
  );
};


const Table = <T,>({
  columns,
  data,
  onRowHover,
  onRowDoubleClick,
  onEdit,
  onDelete,
  onConfig,
  onView,
}: TableProps<T>) => {
  const [hoveredRow, setHoveredRow] = useState<T | null>(null);
  const [sortState, setSortState] = useState<SortState<T>>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDropdownOpeningUp, setIsDropdownOpeningUp] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownIndex(null);
      }
    };

    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);

  const handleSort = (key: keyof T) => {
    setSortState((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      } else if (prev.direction === "asc") {
        return { key, direction: "desc" };
      } else {
        return null;
      }
    });
  };

  const handleDropdownToggle = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
      return;
    }
    
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownHeight = 200;
    const dropdownWidth = 192;

    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenUp = spaceBelow < dropdownHeight;

    setIsDropdownOpeningUp(shouldOpenUp);
    setDropdownPosition({
      top: shouldOpenUp ? rect.top - dropdownHeight + window.scrollY : rect.bottom + window.scrollY,
      left: rect.left - dropdownWidth + rect.width + window.scrollX,
    });
    setOpenDropdownIndex(index);
  };
  
  const sortedData = [...data].sort((a, b) => {
    if (!sortState) return 0;
    const aVal = a[sortState.key];
    const bVal = b[sortState.key];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortState.direction === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortState.direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
  
  const availableActionsForRow = () => [
      { label: "Visualizar", icon: <Visibility fontSize="small" />, handler: onView, className: "hover:text-gray-700" },
      { label: "Editar", icon: <Edit fontSize="small" />, handler: onEdit, className: "hover:text-gray-700" },
      { label: "Configurar", icon: <Settings fontSize="small" />, handler: onConfig, className: "hover:text-brand" },
      { label: "Deletar", icon: <Delete fontSize="small" />, handler: onDelete, className: "text-red-500 hover:text-red-700" },
  ].filter(action => action.handler);


  return (
    <>
      <div className="overflow-x-auto max-h-190 overflow-y-auto">
        <table className="w-full border-collapse border">
          <thead className="sticky top-0 z-10 border-collapse border">
            <tr className="bg-secondary">
              {columns.map((col) => {
                const isSorted = sortState?.key === col.key;
                const direction = sortState?.direction;
                return (
                  <th key={col.key as string} className="border p-2 text-left cursor-pointer select-none" onClick={() => handleSort(col.key)}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-md text-text-light">{col.label}</div>
                      <div className="flex flex-col items-center leading-none">
                        <ArrowDropUp fontSize="small" className={`${isSorted && direction === "asc" ? "text-gray-500" : "text-gray-300"} -mb-1.5`} />
                        <ArrowDropDown fontSize="small" className={`${isSorted && direction === "desc" ? "text-gray-500" : "text-gray-300"} -mt-1.5`} />
                      </div>
                    </div>
                  </th>
                );
              })}
              {(onEdit || onDelete || onView || onConfig) && (
                <th className="border p-2 text-center text-text-light">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => {
                const availableActions = availableActionsForRow();
                return (
                  <tr key={index} className={`border transition-colors ${hoveredRow === row ? "bg-gray-400" : "hover:bg-gray-300"}`} onMouseEnter={() => { setHoveredRow(row); onRowHover?.(row); }} onMouseLeave={() => { setHoveredRow(null); onRowHover?.(null); }} onDoubleClick={() => onRowDoubleClick?.(row)}>
                    {columns.map((col) => {
                      const cellValue = row[col.key];
                      let displayValue: string;
                      if (col.key === "table_index") {
                        displayValue = String(index + 1);
                      } else if (col.type === "time" && cellValue) {
                        const date = new Date(cellValue as string | number | Date);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const year = date.getFullYear();
                        const hour = String(date.getHours()).padStart(2, "0");
                        const minute = String(date.getMinutes()).padStart(2, "0");
                        displayValue = `${day}/${month}/${year} - ${hour}:${minute}`;
                      }
                      else if (col.type === "money") {
                        displayValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(cellValue) || 0);
                      }
                      else if (col.options) {
                        displayValue = col.options.find((opt) => opt.value === cellValue)?.label ?? "-";
                      } else {
                        displayValue = String(cellValue ?? "-");
                      }
                      return (<td key={col.key as string} className="border p-2">{displayValue}</td>);
                    })}
                    {availableActions.length > 0 && (
                      <td className="p-2 text-center">
                        {availableActions.length < 3 ? (
                          <div className="flex justify-center items-center gap-2">
                            {availableActions.map((action, i) => (<button key={i} className={`${action.className} transition`} onClick={() => action.handler!(row)}>{action.icon}</button>))}
                          </div>
                        ) : (
                          <div className="relative inline-block text-left">
                            <button onClick={(e) => handleDropdownToggle(index, e)} className="text-gray-500 hover:text-gray-700"><MoreVert /></button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="text-center p-4">Data not found</td></tr>
            )}
          </tbody>
        </table>

      </div>
      
      {openDropdownIndex !== null && (
        <DropdownPortal dropdownRef={dropdownRef}>
            <div
              style={{
                position: 'absolute',
                top: `${dropdownPosition?.top}px`,
                left: `${dropdownPosition?.left}px`,
              }}
              className={`w-48 rounded-md shadow-lg ring-1 ring-opacity-5 z-50
                ${isDropdownOpeningUp ? "origin-bottom-right" : "origin-top-right"}`}
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                {availableActionsForRow().map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      action.handler!(sortedData[openDropdownIndex]);
                      setOpenDropdownIndex(null);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left ${action.className} transition-colors`}
                    role="menuitem"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
        </DropdownPortal>
      )}
    </>
  );
};

export default Table;
