"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
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
import ApiService from "@/lib/ApiServiceFunctions";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import { id } from "date-fns/locale";
import { transformPartnersResponse } from "@/lib/partnerDataTransform";
import { createDebounce } from "@/lib/utils";

const statusLabels = {
  sending: "Sending",
  sent: "Sent",
  mdn_received: "MDN Received",
  business_ack: "Business ACK",
  failed: "Failed",
  awaiting_mdn: "Awaiting MDN",
  mdn_timeout: "MDN Timeout",
  ack2_rejected: "ACK2 Rejected",
};

function getStatusBadge(status) {
  switch (status) {
    case "sending":
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Sending
        </Badge>
      );
    case "sent":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Sent
        </Badge>
      );
    case "mdn_received":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          MDN Received
        </Badge>
      );
    case "business_ack":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
          Business ACK
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "awaiting_mdn":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Awaiting MDN
        </Badge>
      );
    case "mdn_timeout":
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          MDN Timeout
        </Badge>
      );
    case "ack2_rejected":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          ACK2 Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "sending":
      return <Clock className="h-4 w-4 text-gray-600" />;
    case "sent":
      return <Send className="h-4 w-4 text-blue-600" />;
    case "mdn_received":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "business_ack":
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "awaiting_mdn":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "mdn_timeout":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case "ack2_rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

function MessageActions({ message }) {
  const handleView = () => {
    console.log("View message:", message.id);
    // In real app: navigate to message detail page
  };

  const handleDownload = async (type) => {
    try {
      const res = await ApiService.get(
        `${ApiEndPoints?.AS2_TRANSMISSION?.DOWNLOAD_URL}/${message?.message_id}/download?artifact_type=${type}`
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

  const handleResend = () => {
    console.log("Resend message:", message.id);
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
        <DropdownMenuItem onClick={() => handleDownload("ack")}>
          <Download className="mr-2 h-4 w-4" />
          Download Acknowledgment
        </DropdownMenuItem>
        {(message.status === "failed" || message.status === "mdn_timeout") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleResend}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend Message
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OutboxTable() {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [partnerFilter, setPartnerFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [sortField, setSortField] = useState("sentAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [partners, setPartners] = useState([]);

  // Fetch partners from API
  const fetchPartners = async () => {
    try {
      const response = await ApiService.getPartners();

      if (response.error) {
        setPartners([]);
      } else {
        // Transform API response to UI format
        const transformedPartners = transformPartnersResponse(
          response.data.items || response.data.data || []
        );
        setPartners(transformedPartners);
      }
    } catch (err) {
      console.log("fetchPartners Error : ", err?.message);
      setPartners([]);
    }
  };

  // Fetch partners on component mount and when filters change
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchMessages = async (fileQuery) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (currentPage) params.append("page", currentPage);
      if (pageSize) params.append("size", pageSize);
      if (fileQuery) params.append("fileQuery", fileQuery);
      if (statusFilter) params.append("status", statusFilter);
      if (partnerFilter?.id) params.append("partner_id", partnerFilter?.id);
      if (priorityFilter) params.append("priority", priorityFilter);

      const response = await ApiService.get(
        `${ApiEndPoints.AS2_TRANSMISSION.GET_HISTORY}?${params.toString()}`
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
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, pageSize, statusFilter, partnerFilter, priorityFilter]);

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

  const handleBulkResend = () => {
    console.log("Bulk resend messages:", selectedMessages);
  };

  const handleRefresh = async () => {
    await fetchMessages();
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
              <CardTitle>Outbox Messages</CardTitle>
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
            <CardTitle>Outbox Messages</CardTitle>
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
                <Button variant="outline" size="sm" onClick={handleBulkResend}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Selected
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <SelectItem value="transmitting">Transmitting</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
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
          {/* <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        {/* Table */}
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
                      onClick={() => handleSort("recipient")}
                      className="h-auto p-0 font-medium"
                    >
                      Recipient
                      {getSortIcon("recipient")}
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
                      onClick={() => handleSort("sentAt")}
                      className="h-auto p-0 font-medium"
                    >
                      Sent At
                      {getSortIcon("sentAt")}
                    </Button>
                  </th>
                  <th className="p-4 text-left">MDN Status</th>
                  {/* <th className="p-4 text-left">ACK2 Status</th> */}
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading ? (
                  messages.map((message) => (
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
                        <div className="font-mono text-sm">
                          {message.message_id}
                        </div>
                        {message.priority === "urgent" && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            Urgent
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 font-medium">
                        {message.partner_name}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{message.filename}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(message.file_size)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(message.sent_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(message.sent_at)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {message.status === "received" && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {message.status === "awaiting" && (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                          {message.status === "timeout" && (
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          )}
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(message.status)}
                              {getStatusBadge(message.status)}
                            </div>
                          </td>
                        </div>
                      </td>
                      {/* <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {message.ack2Status === "accepted" && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {message.ack2Status === "pending" && (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                          {message.ack2Status === "rejected" && (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          {message.ack2Status === "failed" && (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm capitalize">
                            {message.ack2Status}
                          </span>
                        </div>
                      </td> */}
                      <td className="p-4">
                        <MessageActions message={message} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <div
                    role="status"
                    aria-live="polite"
                    aria-label="Loading"
                    className={`inline-block`}
                    style={{ width: 48, height: 48 }}
                  >
                    <div
                      className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 animate-spin"
                      style={{
                        mask: "radial-gradient(farthest-side, transparent 60%, black 61%)",
                        WebkitMask:
                          "radial-gradient(farthest-side, transparent 60%, black 61%)",
                      }}
                    />
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
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
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
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
