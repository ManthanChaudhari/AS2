'use client'

import { useMemo, useState, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

const ROW_HEIGHT = 60

function VirtualRow({ index, style, data }) {
  const { rows, prepareRow } = data
  const row = rows[index]
  
  if (!row) return null
  
  prepareRow(row)
  
  return (
    <div
      style={style}
      className="flex items-center border-b hover:bg-muted/50"
    >
      {row.getVisibleCells().map((cell) => (
        <div
          key={cell.id}
          className="px-4 py-2 flex-1"
          style={{ width: cell.column.getSize() }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  )
}

export function VirtualTable({ 
  data, 
  columns, 
  height = 400,
  searchable = true,
  filterable = true,
  sortable = true 
}) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  })

  const { rows } = table.getRowModel()

  const itemData = useMemo(
    () => ({
      rows,
      prepareRow: () => {}, // Not needed with TanStack Table v8
    }),
    [rows]
  )

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="flex items-center space-x-4">
          {searchable && (
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          )}
          
          {filterable && (
            <Select
              value={columnFilters[0]?.value ?? 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setColumnFilters([])
                } else {
                  setColumnFilters([{ id: 'status', value }])
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Table Header */}
      <div className="border rounded-lg">
        <div className="flex bg-muted/50 border-b">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="px-4 py-3 font-medium text-left flex-1"
                style={{ width: header.getSize() }}
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={
                      header.column.getCanSort()
                        ? 'cursor-pointer select-none flex items-center space-x-1'
                        : ''
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Virtual List */}
        <List
          height={height}
          itemCount={rows.length}
          itemSize={ROW_HEIGHT}
          itemData={itemData}
        >
          {VirtualRow}
        </List>
      </div>

      {/* Table Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {rows.length} of {data.length} rows
        </div>
        <div>
          {globalFilter && `Filtered by: "${globalFilter}"`}
        </div>
      </div>
    </div>
  )
}

// Hook for optimized table data
export function useVirtualTableData(data, pageSize = 1000) {
  return useMemo(() => {
    // Only show first pageSize items for performance
    return data.slice(0, pageSize)
  }, [data, pageSize])
}