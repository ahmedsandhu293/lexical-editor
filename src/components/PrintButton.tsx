
import React from "react";

interface PrintButtonProps {
    targetRef: React.RefObject<HTMLDivElement | null>;
}

const PrintButton: React.FC<PrintButtonProps> = ({ targetRef }) => {
  const handlePrint = () => {
    if (!targetRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 20px;
            }
            h1 { font-size: 2em; margin: 0.5em 0; }
            h2 { font-size: 1.5em; margin: 0.5em 0; }
            h3 { font-size: 1.2em; margin: 0.5em 0; }
            p { margin: 0.5em 0; }
            b, strong { font-weight: bold; }
            i, em { font-style: italic; }
            u { text-decoration: underline; }
            code {
              background: #eee;
              border: 1px solid #ccc;
              padding: 2px 4px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          ${targetRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Print
    </button>
  );
};

export default PrintButton;
