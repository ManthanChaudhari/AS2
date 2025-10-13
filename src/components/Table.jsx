"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TableComp({
  hideScrollBar = true,
  columns,
  data,
  setRef,
  className = "",
  isNotPagination = false,
  defaultPageSize = 10, // Default to 10 rows if not provided
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: !isNotPagination ? pageSize : data.length,
      },
    },
  });

  const caseRef = useRef();

  useEffect(() => {
    if (setRef) {
      setRef(caseRef);
    }
  }, [setRef]);

  const handleRowsPerPageChange = (value) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    table.setPageSize(newPageSize);
  };

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className="relative">
      <div className="rounded-md overflow-hidden bg-white shadow-md border border-blue-200 mt-1">
        <div
          className={`${className}`}
          style={{ width: "100%", minWidth: "100%" }}
        >
          <div className="overflow-x-auto">
            <div
              className={`max-h-[400px] overflow-y-auto ${
                hideScrollBar ? "hide-scrollbar" : ""
              }`}
              style={{ overscrollBehavior: "contain" }}
              ref={caseRef}
            >
              <Table className="w-full" style={{ tableLayout: "fixed" }}>
                <TableHeader className="sticky top-0 z-10 bg-white">
                  {table?.getHeaderGroups()?.map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      style={{
                        background:
                          "linear-gradient(to right, #e8f0fe 0%, #f0f9ff 100%)",
                      }}
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="px-2 py-1.5 border-b border-blue-200 text-gray-500"
                          style={{
                            width: header.column.columnDef.width || "auto",
                          }}
                        >
                          <div className="flex items-center select-none group">
                            <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table?.getRowModel().rows?.length ? (
                    table?.getRowModel().rows?.map((row, i) => (
                      <TableRow
                        key={row.id}
                        className="bg-gray-50 hover:bg-blue-100 transition-colors duration-150"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-2 py-3 border-b border-blue-200 bg-white"
                            style={{
                              width: cell.column.columnDef.width || "auto",
                            }}
                          >
                            <div className="text-xs text-gray-800">
                              {cell.column.id === "s_no"
                                ? table?.getState().pagination.pageIndex *
                                    table?.getState().pagination.pageSize +
                                  i +
                                  1
                                : flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="px-2 py-3 border-b border-blue-200 bg-white"
                      >
                        <div className="py-4 text-gray-500">No results.</div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {!isNotPagination && (
        <div className="mt-4 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-white dark:bg-slate-900 p-4 shadow-md">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
              <span>
                Showing page {currentPage} of {totalPages} ({data.length}{" "}
                records displayed)
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex items-center gap-2 keep-active">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Rows per page
                </p>
                <Select
                  value={`${pageSize}`}
                  onValueChange={handleRowsPerPageChange}
                  className={"keep-active"}
                >
                  <SelectTrigger className="h-8 w-[70px] border-blue-200 dark:border-blue-700 keep-active">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 15, 25, 50, 75].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-center gap-2 sm:justify-end keep-active">
                <div className="flex min-w-[100px] items-center justify-center rounded-md border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}