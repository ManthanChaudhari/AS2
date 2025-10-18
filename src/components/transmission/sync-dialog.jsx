import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import ApiService from "@/lib/ApiServiceFunctions";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";

export default function SyncDialog({ partners, fetchMessages }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);

  const handleSubmit = async () => {
    if (!selectedPartner) {
      alert("Please select an option");
      return;
    }

    setSubmitting(true);
    setResponseMessage("");

    try {
      const partnerIdentifier = `${selectedPartner?.name}-${selectedPartner?.id}`;
      const response = await ApiService.post(
        `${ApiEndPoints.AS2_TRANSMISSION.SYNC_INBOX_FILE}?partner_identifiers=${partnerIdentifier}`
      );
      if (!response?.data) return;
      await fetchMessages()
      setOpen(false);
      setSelectedPartner(null);
      setResponseMessage("");
    } catch (error) {
      console.error("Error submitting:", error);
      setResponseMessage("Error: Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all hover:shadow-xl">
            Sync
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Sync Partner
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Partner
              </label>
              <Select
                value={selectedPartner}
                onValueChange={setSelectedPartner}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners?.map((partner) => (
                    <SelectItem value={partner}>{partner?.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {responseMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  responseMessage.includes("Success")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {responseMessage}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting && (
                <Loader2 size={16} className="animate-spin mr-2" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
