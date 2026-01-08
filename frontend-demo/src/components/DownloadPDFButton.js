// src/components/DownloadPDFButton.js
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DownloadPDFButton = ({ targetId, fileName = "report.pdf" }) => {
  const downloadPDF = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      alert("Section not found!");
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  };

  return (
    <button
      onClick={downloadPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all"
    >
      Download as PDF
    </button>
  );
};

export default DownloadPDFButton;
