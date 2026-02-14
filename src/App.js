import React, { useState } from 'react';
import { jsPDF } from "jspdf";

function App() {
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [service, setService] = useState('');

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Design the PDF content
    doc.setFontSize(22);
    doc.text("OFFICIAL INVOICE", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Client Name: ${client}`, 20, 50);
    doc.text(`Service Provided: ${service}`, 20, 60);
    doc.line(20, 65, 190, 65); // Draw a line
    
    doc.setFontSize(16);
    doc.text(`TOTAL DUE: $${amount}`, 20, 80);
    
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 20, 100);

    // Trigger the "One-Click" download
    doc.save(`Invoice_${client}.pdf`);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '500px', margin: 'auto', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2>Simple Invoice Generator</h2>
        <p>Fill in the details below to generate your PDF.</p>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Client Name:</label><br/>
          <input style={{width: '100%', padding: '8px', marginTop: '5px'}} type="text" onChange={(e) => setClient(e.target.value)} placeholder="e.g. John Doe" />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Service:</label><br/>
          <input style={{width: '100%', padding: '8px', marginTop: '5px'}} type="text" onChange={(e) => setService(e.target.value)} placeholder="e.g. Consulting" />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Amount ($):</label><br/>
          <input style={{width: '100%', padding: '8px', marginTop: '5px'}} type="number" onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>

        <button 
          onClick={downloadPDF}
          style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          Download PDF Invoice
        </button>
      </div>
    </div>
  );
}

export default App;
