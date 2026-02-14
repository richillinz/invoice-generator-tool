import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [client, setClient] = useState('');

  // Check if they already unlocked it
  useEffect(() => {
    const savedStatus = localStorage.getItem('app_unlocked');
    if (savedStatus === 'true') setIsLocked(false);
  }, []);

  const handleUnlock = () => {
    // THIS IS WHERE THE KEY IS SET
    if (licenseKey === 'PRO-INV-2026') {
      localStorage.setItem('app_unlocked', 'true');
      setIsLocked(false);
    } else {
      alert("Invalid License Key. Please use: PRO-INV-2026");
    }
  };

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const calculateTotal = () => items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("INVOICE PRO", 20, 20);
    doc.setFontSize(12);
    doc.text(`Client: ${client}`, 20, 40);
    let y = 60;
    items.forEach(item => {
      doc.text(`${item.desc} | Qty: ${item.qty} | $${item.price}`, 20, y);
      y += 10;
    });
    doc.text(`Total: $${calculateTotal()}`, 20, y + 10);
    doc.save(`Invoice_${client}.pdf`);
  };

  if (isLocked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0c', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#1e293b', padding: '40px', borderRadius: '15px', textAlign: 'center', border: '1px solid #334155' }}>
          <h2 style={{ color: '#38bdf8' }}>License Required</h2>
          <p>Enter your license key to activate.</p>
          <input 
            type="text" 
            placeholder="PRO-INV-2026" 
            style={{ padding: '12px', borderRadius: '5px', width: '100%', margin: '15px 0', background: '#0f172a', color: 'white', border: '1px solid #334155' }}
            onChange={(e) => setLicenseKey(e.target.value)}
          />
          <button 
            onClick={handleUnlock} 
            style={{ padding: '12px 20px', background: '#38bdf8', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
            Activate Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', background: '#1e293b', padding: '30px', borderRadius: '20px' }}>
        <h1 style={{ color: '#38bdf8' }}>Invoice Builder Pro</h1>
        <input type="text" placeholder="Client Name" style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} onChange={(e) => setClient(e.target.value)} />
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="Service" style={{ flex: 3, padding: '8px' }} onChange={(e) => {
              const newItems = [...items]; newItems[index].desc = e.target.value; setItems(newItems);
            }} />
            <input type="number" placeholder="Qty" style={{ flex: 1, padding: '8px' }} onChange={(e) => {
              const newItems = [...items]; newItems[index].qty = e.target.value; setItems(newItems);
            }} />
            <input type="number" placeholder="Price" style={{ flex: 1, padding: '8px' }} onChange={(e) => {
              const newItems = [...items]; newItems[index].price = e.target.value; setItems(newItems);
            }} />
          </div>
        ))}
        <button onClick={addItem} style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ Add Row</button>
        <div style={{ fontSize: '24px', textAlign: 'right', marginBottom: '20px' }}>Total: ${calculateTotal()}</div>
        <button onClick={downloadPDF} style={{ width: '100%', padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Generate & Download PDF</button>
      </div>
    </div>
  );
}

export default App;
