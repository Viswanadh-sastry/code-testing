import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { createGroup } from "../../../api/GroupAPI";

interface IAddGroupProps {
  onCloseImportGroup: () => void;
  onGetGroupList: () => void;
  onShowImportGroup: boolean;
}

const ImportGroup = ({ onCloseImportGroup, onGetGroupList, onShowImportGroup }: IAddGroupProps) => {
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

            const groupData = {
              name: row.NAME,
              description: row.DESCRIPTION,
              metadata: metadata, // Add the parsed metadata object
              parent_id: row.PARENT_ID,
              status: row.STATUS,
            };
            await createGroup(groupData);
          }

          toast.success("Groups created successfully");
          onCloseImportGroup();
          onGetGroupList();
        } catch (error: any) {
          toast.error(`Error creating group: ${error.message}`);
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

  // const show = onShowImportGroup ? true : false;

  return (
    <Modal show={onShowImportGroup} onHide={onCloseImportGroup} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add Groups</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Add csv file containing group names. Find a sample csv file here
          <br />
          <span className="text-muted">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </span>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onCloseImportGroup} className="btn btn-light btn-elevate" disabled={isSubmitting}>
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

export { ImportGroup };
