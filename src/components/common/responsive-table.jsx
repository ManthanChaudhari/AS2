'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'

// Mobile-friendly table component that collapses to cards on small screens
export function ResponsiveTable({ 
  data, 
  columns, 
  renderMobileCard, 
  className = "",
  showPagination = true 
}) {
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className={className}>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <ScrollArea className="w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {columns.map((column, index) => (
                    <th key={index} className="p-4 text-left font-medium">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-muted/50">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-4">
                        {column.cell ? column.cell(row) : row[column.accessorKey]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((item, index) => (
          <Card key={index}>
            <Collapsible
              open={expandedRows.has(item.id)}
              onOpenChange={() => toggleRow(item.id)}
            >
              <CollapsibleTrigger asChild>
                <div className="p-4 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {renderMobileCard ? renderMobileCard(item, false) : (
                        <div>
                          <p className="font-medium">{item.name || item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description || item.subtitle}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {expandedRows.has(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 border-t">
                  {renderMobileCard ? renderMobileCard(item, true) : (
                    <div className="pt-3 space-y-2">
                      {columns.slice(2).map((column, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {column.header}:
                          </span>
                          <span className="text-sm font-medium">
                            {column.cell ? column.cell(item) : item[column.accessorKey]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  )
}