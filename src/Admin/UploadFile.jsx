import React, { useRef, useState } from "react";
import { RiFileExcel2Fill } from "react-icons/ri";

const BASE_URL = "https://api.onstage.co.in/api/v1";

export default function UploadFile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const showMsg = (message, type = "success") => {
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      alert(message);
    }
  };

  const handleBoxClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      showMsg("Please select an Excel file", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://api.onstage.co.in/api/v1/upload-products?file",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        showMsg(data.message || "File uploaded successfully", "success");
        setFile(null);

        if (fileRef.current) {
          fileRef.current.value = "";
        }
      } else {
        showMsg(data.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error(error);
      showMsg("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-wrapper">
      <h1>Upload File</h1>
      <p>Upload Excel sheet and submit</p>

      <div className="upload-box-modern" onClick={handleBoxClick}>
        <RiFileExcel2Fill className="excel-icon" />

        <p className="upload-title">
          {file ? file.name : "Click or drag Excel file here"}
        </p>

        <p className="upload-sub">Supports .xlsx, .xls, .csv</p>

        <input
          type="file"
          ref={fileRef}
          className="file-input"
          accept=".xls,.xlsx,.csv"
          onChange={handleFileChange}
        />
      </div>

      <button className="upload-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
}