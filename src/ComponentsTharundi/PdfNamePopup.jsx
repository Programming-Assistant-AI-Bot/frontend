// First, install required dependencies:
// npm install sonner @radix-ui/react-dialog

// components/PdfNamePopup.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PdfNamePopup = ({ isOpen, onClose, onSubmit }) => {
  const [docName, setDocName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (docName.trim()) {
      onSubmit(docName);
      setDocName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Name your document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Enter document name"
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};