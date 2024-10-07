import Papa from "papaparse";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createThing } from "../../../api/ThingAPI";

interface IAddThingProps {
  onCloseImportThing: () => void;
  onGetThingList: () => void;
  onShowImportThing: boolean;
}

const ImportThings = ({ onCloseImportThing, onGetThingList, onShowImportThing }: IAddThingProps) => {
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
            // Process and convert METADATA string to a proper JSON object
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

            // Process and convert TAGS string to an array
            let tags: string[] = [];
            try {
              if (row.TAGS) {
                // Split the TAGS string by commas and trim spaces
                tags = row.TAGS.split(",").map((tag: string) => tag.trim());
              }
            } catch (e) {
              toast.error("Error parsing tags. Ensure they are in valid format.");
              setIsSubmitting(false);
              return;
            }

            const thingData = {
              name: row.NAME,
              metadata, // Add the processed metadata object
              status: row.STATUS,
              tags, // Add the processed tags array
            };

            await createThing(thingData);
          }

          toast.success("Things created successfully");
          onCloseImportThing();
          onGetThingList();
        } catch (error: any) {
          toast.error(`Error creating thing: ${error.message}`);
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
    <Modal show={onShowImportThing} onHide={onCloseImportThing} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add Things</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Add csv file containing thing names. Find a sample csv file here
          <br />
          <span className="text-muted">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </span>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onCloseImportThing} className="btn btn-light btn-elevate mx-2" disabled={isSubmitting}>
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

export { ImportThings };
