import Papa from "papaparse";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createChannel } from "../../../api/ChannelsAPI";

interface IAddChannelProps {
  onCloseImportChannel: () => void;
  onGetChannelList: () => void;
  onShowImportChannel: boolean;
}

const ImportChannel = ({ onCloseImportChannel, onGetChannelList, onShowImportChannel }: IAddChannelProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    setIsSubmitting(true);

    // Parse the CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const { data } = results;
        try {
          for (const row of data) {
            // Convert METADATA string to an object
            let metadata = {};
            try {
              if (row.METADATA) {
                // Split the METADATA string by commas to get key-value pairs
                const metadataPairs = row.METADATA.split(",");
                metadataPairs.forEach((pair: string) => {
                  const [key, value] = pair.split(":").map((str) => str.trim());
                  metadata = { ...metadata, [key]: value };
                });
              }
            } catch (e) {
              toast.error("Error parsing metadata. Ensure it is in valid format.");
              setIsSubmitting(false);
              return;
            }

            const channelData = {
              name: row.NAME,
              description: row.DESCRIPTION,
              metadata, // Add the parsed metadata object
              parent_id: row.PARENT_ID,
              status: row.STATUS,
            };
            await createChannel(channelData);
          }

          toast.success("Channels created successfully");
          onCloseImportChannel();
          onGetChannelList();
        } catch (error: any) {
          toast.error(`Error creating channel: ${error.message}`);
        } finally {
          setIsSubmitting(false);
        }
      },
      error: (error: any) => {
        toast.error(`Error parsing CSV: ${error.message}`);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Modal show={onShowImportChannel} onHide={onCloseImportChannel} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add Channels</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Add csv file containing channel names. Find a sample csv file here
          <br />
          <span className="text-muted">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </span>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onCloseImportChannel} className="btn btn-light btn-elevate mx-2" disabled={isSubmitting}>
            No, Cancel
          </button>
          <> </>
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            <span className="indicator-label">{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export { ImportChannel };
