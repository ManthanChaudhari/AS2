"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Inbox,
  Package,
  RotateCcw,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transformPartnersResponse } from "@/lib/partnerDataTransform";
import ApiService from "@/lib/ApiServiceFunctions";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import SyncDialog from "./sync-dialog";
import { createDebounce } from "@/lib/utils";

const messageTypeLabels = {
  icsr: "ICSR",
  acknowledgment: "Acknowledgment",
  safety_report: "Safety Report",
  periodic_report: "Periodic Report",
  clinical_data: "Clinical Data",
  regulatory_query: "Regulatory Query",
};

function getStatusBadge(status) {
  switch (status) {
    case "new":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          New
        </Badge>
      );
    case "processing":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Processing
        </Badge>
      );
    case "validated":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Validated
        </Badge>
      );
    case "validation_failed":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Validation Failed
        </Badge>
      );
    case "routed":
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          Routed
        </Badge>
      );
    case "routing_failed":
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          Routing Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "new":
      return <Inbox className="h-4 w-4 text-blue-600" />;
    case "processing":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "validated":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "validation_failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "routed":
      return <Package className="h-4 w-4 text-purple-600" />;
    case "routing_failed":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

function getValidationStatusBadge(status) {
  switch (status) {
    case "passed":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          Passed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          Failed
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Processing
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-600">
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getRoutingStatusBadge(status, routedTo) {
  switch (status) {
    case "routed":
      return (
        <div className="flex flex-col">
          <Badge
            variant="outline"
            className="text-purple-600 border-purple-600"
          >
            Routed
          </Badge>
          {routedTo && (
            <span className="text-xs text-muted-foreground mt-1">
              {routedTo}
            </span>
          )}
        </div>
      );
    case "failed":
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          Failed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function MessageActions({ message }) {
  const handleView = () => {
    console.log("View message:", message.id);
    // In real app: navigate to message detail page
  };

  const handleDownload = async (type) => {
    console.log({ message });
    try {
      const res = await ApiService.get(
        `${ApiEndPoints?.AS2_TRANSMISSION?.GET_SIGNED_INBOX_URL}/${message?.message_id}?artifact_type=${type}`
      );

      const { download_url } = res?.data || {};

      if (!download_url) {
        console.error("No presigned URL found in response");
        return;
      }

      window.open(download_url, "_blank");
    } catch (error) {
      console.error("handleDownload Error:", error?.message);
    }
  };

  const handleRevalidate = () => {
    console.log("Revalidate message:", message.id);
  };

  const handleReroute = () => {
    console.log("Reroute message:", message.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("original")}>
          <Download className="mr-2 h-4 w-4" />
          Download Original File
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("mdn")}>
          <Download className="mr-2 h-4 w-4" />
          Download MDN File
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("status")}>
          <Download className="mr-2 h-4 w-4" />
          Download Status File
        </DropdownMenuItem>
        {message.validationStatus === "failed" && (
          <DropdownMenuItem onClick={handleRevalidate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-validate
          </DropdownMenuItem>
        )}
        {message.routingStatus === "failed" && (
          <DropdownMenuItem onClick={handleReroute}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Re-route
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InboxTable() {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [partnerFilter, setPartnerFilter] = useState(null);
  const [sortField, setSortField] = useState("received_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [partners, setPartners] = useState([]);

  const fetchMessages = async (fileQuery) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (currentPage) params.append("page", currentPage);
      if (pageSize) params.append("size", pageSize);
      if (fileQuery) params.append("filename", fileQuery);
      if (statusFilter) params.append("status", statusFilter);
      if (partnerFilter?.id) params.append("partner_id", partnerFilter?.id);

      const response = await ApiService.get(
        `${ApiEndPoints.AS2_TRANSMISSION.GET_INBOX}?${params.toString()}`
      );

      if (response.error) {
        console.error("Failed to fetch partner stats:", response.error);
      } else {
        setMessages(response.data.items);
        setTotalMessages(response.data.total);
        setTotalPages(response.data.pages);
      }
    } catch (err) {
      console.error("Error fetching partner stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    createDebounce(async (query) => {
      await fetchMessages(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery)
  },[searchQuery])

  useEffect(() => {
    fetchMessages();
  }, [currentPage, pageSize, statusFilter, partnerFilter]);

  const fetchPartners = async () => {
    try {
      const response = await ApiService.getPartners();

      if (response.error) {
        setPartners([]);
      } else {
        const transformedPartners = transformPartnersResponse(
          response.data.items || response.data.data || []
        );
        setPartners(transformedPartners);
      }
    } catch (err) {
      setPartners([]);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMessages(messages.map((m) => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectMessage = (messageId, checked) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, messageId]);
    } else {
      setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
    }
  };

  const handleBulkDownload = () => {
    console.log("Bulk download messages:", selectedMessages);
  };

  const handleBulkRevalidate = () => {
    console.log("Bulk revalidate messages:", selectedMessages);
  };

  const handleBulkReroute = () => {
    console.log("Bulk reroute messages:", selectedMessages);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    console.log("Refreshing inbox data...");
    fetchMessages();
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <SortAsc className="ml-2 h-4 w-4" />
    ) : (
      <SortDesc className="ml-2 h-4 w-4" />
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle>Inbox Messages</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading messages...
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle>Inbox Messages</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              Last updated: {formatTimestamp(lastUpdated.toISOString())}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedMessages.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Selected ({selectedMessages.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRevalidate}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-validate Selected
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkReroute}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Re-route Selected
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <SyncDialog partners={partners} fetchMessages={fetchMessages} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by filename, partner, or message ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Statuses</SelectItem>
                <SelectItem value="processed">Processing</SelectItem>
                <SelectItem value="failed">Validation Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Partners</SelectItem>
                {partners?.map((partner) => (
                  <SelectItem key={partner?.id} value={partner}>
                    {partner?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={
                        selectedMessages.length === messages.length &&
                        messages.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("message_id")}
                      className="h-auto p-0 font-medium"
                    >
                      Message ID
                      {getSortIcon("message_id")}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("from")}
                      className="h-auto p-0 font-medium"
                    >
                      From
                      {getSortIcon("from")}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("partner_name")}
                      className="h-auto p-0 font-medium"
                    >
                      To
                      {getSortIcon("partner_name")}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("filename")}
                      className="h-auto p-0 font-medium"
                    >
                      Filename
                      {getSortIcon("filename")}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("received_at")}
                      className="h-auto p-0 font-medium"
                    >
                      Received At
                      {getSortIcon("received_at")}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedMessages.includes(message.id)}
                        onCheckedChange={(checked) =>
                          handleSelectMessage(message.id, checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(message.status)}
                        {getStatusBadge(message.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        {message.message_id?.slice(0, 20)}...
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{message.as2_from}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {message.fromAs2Id}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{message.partner_name}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{message.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(message.file_size)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(message.received_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(message.received_at)}
                      </div>
                    </td>
                    {/* <td className="p-4">
                      {getValidationStatusBadge(message.validationStatus)}
                      {message.validationErrors && (
                        <div className="text-xs text-red-600 mt-1">
                          {message.validationErrors.length} error(s)
                        </div>
                      )}
                    </td> */}
                    {/* <td className="p-4">
                      {getRoutingStatusBadge(
                        message.routingStatus,
                        message.routedTo
                      )}
                      {message.routingError && (
                        <div className="text-xs text-red-600 mt-1">
                          {message.routingError}
                        </div>
                      )}
                    </td> */}
                    <td className="p-4">
                      <MessageActions message={message} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalMessages)} of{" "}
              {totalMessages} messages
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
