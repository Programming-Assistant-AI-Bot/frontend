  const PdfUploadDialog = () => (
  <Dialog open={showPdfDialog} onOpenChange={() => setShowPdfDialog(false)}>
    <DialogContent className="bg-[#392748] text-white border-none">
      <DialogHeader>
        <DialogTitle className="text-white">Upload PDF Document</DialogTitle>
        <DialogDescription className="text-gray-300">
          Please provide a name and select your PDF file
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <Input 
          placeholder="Document Name"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          className="bg-[#25003E] border-none text-white"
        />
        <Input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="bg-[#25003E] border-none text-white file:text-white"
        />
        <Button 
          onClick={handlePdfUpload}
          className="bg-purple-600 hover:bg-purple-700 w-full"
        >
          Upload Document
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
