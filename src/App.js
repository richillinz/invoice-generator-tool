import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [client, setClient] = useState('');

  // Check if they already unlocked it before
  useEffect(() => {
    const savedKey = localStorage.getItem('invoice_pro_key');
    if (savedKey === 'PRO-INV-2026') { // In production, you'd verify this via API
      setIsLocked(false);
    }
  }, []);

  const handleUnlock = () => {
    if (licenseKey === 'PRO-INV-2026') { 
      localStorage.setItem('invoice_pro_key', licenseKey);
      setIsLocked(false);
    } else {
      alert("Invalid License Key");
    }
  };

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  
  const calculateTotal = () => items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("PRO INVOICE", 20, 20);
    doc.text(`Client: ${client}`, 20, 40);
    let y = 60;
    items.forEach(item => {
      doc.text(`${item.desc} - ${item.qty} x $${item.price}`, 20, y);
      y += 10;
    });
    doc.text(`GRAND TOTAL: $${calculateTotal()}`, 20, y + 10);
    doc.save(`Invoice_${client}.pdf`);
  };

  if (isLocked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0c', color: 'white' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '40px', borderRadius: '15px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
          <h2>Premium Invoice Tool Locked</h2>
          <p>Please enter your license key to continue.</p>
          <input 
            type="text" 
            placeholder="XXXX-XXXX-XXXX" 
            style={{ padding: '10px', borderRadius: '5px', border: 'none', margin: '10px 0', width: '100%' }}
            onChange={(e) => setLicenseKey(e.target.value)}
          />
          <button onClick={handleUnlock} style={{ padding: '10px 20px', background: '#00f2ff', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Unlock App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', background: 'rgba(30, 41, 59, 0.7)', padding: '30px', borderRadius: '20px', border: '1px solid #334155' }}>
        <h1 style={{ color: '#38bdf8' }}>Invoice Builder Pro</h1>
        
        <input type="text" placeholder="Client Name" className="w-full p-2 mb-4 bg-slate-800 border border-slate-700 rounded" onChange={(e) => setClient(e.target.value)} />

        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="Description" style={{ flex: 3 }} onChange={(e) => {
              const newItems = [...items];
              newItems[index].desc = e.target.value;
              setItems(newItems);
            }} />
            <input type="number" placeholder="Qty" style={{ flex: 1 }} onChange={(e) => {
              const newItems = [...items];
              newItems[index].qty = e.target.value;
              setItems(newItems);
            }} />
            <input type="number" placeholder="Price" style={{ flex: 1 }} onChange={(e) => {
              const newItems = [...items];
              newItems[index].price = e.target.value;
              setItems(newItems);
            }} />
          </div>
        ))}

        <button onClick={addItem} style={{ marginBottom: '20px', color: '#38bdf8', cursor: 'pointer' }}>+ Add Item</button>
        
        <div style={{ fontSize: '24px', textAlign: 'right', marginBottom: '20px' }}>
          Total: <span style={{ color: '#10b981' }}>${calculateTotal()}</span>
        </div>

        <button onClick={downloadPDF} style={{ width: '100%', padding: '15px', background: '#38bdf8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}>
          Generate PDF
        </button>
      </div>
    </div>
  );
}

export default App;
