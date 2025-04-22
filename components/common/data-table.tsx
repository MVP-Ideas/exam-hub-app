"use client";

import {
  Table as ReactTable,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PaginationResponse } from "@/lib/types/pagination";
import { Button } from "../ui/button";
import { FileQuestion } from "lucide-react";

interface DataTableProps<TData, TValue> {
  table: ReactTable<TData>;
  tableName?: string;
  columns: ColumnDef<TData, TValue>[];
  isLoading: boolean;
  isError?: boolean;
  classNames?: {
    container?: string;
  };
  pagination?: PaginationResponse<TData>;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
}

export default function DataTable<TData, TValue>({
  table,
  tableName,
  columns,
  isLoading,
  isError,
  classNames,
  pagination,
  onNextPage,
  onPreviousPage,
}: DataTableProps<TData, TValue>) {
  const rows = table.getRowModel().rows;

  // Showing 1-5 of x learners
  const totalItems = pagination?.totalItems || 0;
  const pageSize = pagination?.pageSize || 10;
  const startItem =
    (pagination?.page || 0) > (pagination?.totalPages || 0)
      ? totalItems
      : ((pagination?.page || 1) - 1) * pageSize + 1;
  const endItem = Math.min((pagination?.page || 1) * pageSize, totalItems);

  return (
    <div
      className={cn(
        "h-full w-full overflow-auto rounded-lg border",
        classNames?.container,
      )}
    >
      <Table>
        <TableHeader className="bg-accent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="font-bold" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isError ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="pointer-events-none flex h-[calc(45vh-49px)] flex-col items-center justify-center gap-2">
                  <div className="bg-muted rounded-full p-4">
                    <FileQuestion size={48} className="text-destructive" />
                  </div>
                  <div className="text-destructive text-sm font-medium">
                    Error fetching data
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : isLoading ? (
            Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {table.getVisibleFlatColumns().map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {!["select", "actions"].includes(column.id) && (
                      <Skeleton
                        className={cn(
                          "p-2",
                          rowIndex % 2 === 0 ? "w-full" : "w-1/2",
                        )}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.id.endsWith("_actions") ? "py-0" : "w-fit"}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </motion.div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="pointer-events-none flex h-[calc(45vh-49px)] flex-col items-center justify-center gap-2">
                  <div className="bg-muted rounded-full p-4">
                    <FileQuestion size={48} className="text-muted-foreground" />
                  </div>
                  <div>Nothing to see here</div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length}>
              <div className="flex w-full flex-row items-center justify-between px-2">
                <h2 className="font-base text-muted-foreground">
                  Showing {startItem} - {endItem} of {totalItems}{" "}
                  {tableName?.toLowerCase() || "items"}
                </h2>
                <div className="flex flex-row gap-2">
                  <Button
                    disabled={pagination?.page === 1}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer font-bold"
                    onClick={onPreviousPage}
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={
                      pagination?.page === pagination?.totalPages ||
                      pagination?.totalPages === 0
                    }
                    variant="outline"
                    size="sm"
                    className="cursor-pointer px-5 font-bold"
                    onClick={onNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
