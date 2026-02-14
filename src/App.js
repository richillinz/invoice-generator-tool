import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [client, setClient] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [legalTerms, setLegalTerms] = useState('Payment is due within 30 days. Late fees may apply.');

  useEffect(() => {
    const savedStatus = localStorage.getItem('app_unlocked');
    if (savedStatus === 'true') setIsLocked(false);
  }, []);

  const handleUnlock = () => {
    if (licenseKey === 'PRO-INV-2026') {
      localStorage.setItem('app_unlocked', 'true');
      setIsLocked(false);
    } else {
      alert("Invalid License Key.");
    }
  };

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const taxTotal = subtotal * (taxRate / 100);
  const grandTotal = subtotal + taxTotal;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42); // Dark Theme Header
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(24);
    doc.text("INVOICE PRO", 20, 25);
    
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text("POWERED BY RCL INTEGRATED VENTURES LLC", 130, 25);

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Client: ${client}`, 20, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 55);
    
    // Table Header
    doc.line(20, 65, 190, 65);
    doc.text("Description", 20, 72);
    doc.text("Qty", 120, 72);
    doc.text("Price", 145, 72);
    doc.text("Total", 170, 72);
    doc.line(20, 75, 190, 75);

    let y = 85;
    items.forEach(item => {
      doc.text(item.desc, 20, y);
      doc.text(item.qty.toString(), 120, y);
      doc.text(`$${item.price}`, 145, y);
      doc.text(`$${item.qty * item.price}`, 170, y);
      y += 10;
    });

    doc.line(130, y, 190, y);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 145, y + 10);
    doc.text(`Tax (${taxRate}%): $${taxTotal.toFixed(2)}`, 145, y + 20);
    doc.setFontSize(14);
    doc.text(`GRAND TOTAL: $${grandTotal.toFixed(2)}`, 140, y + 35);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("TERMS & CONDITIONS:", 20, 260);
    doc.text(doc.splitTextToSize(legalTerms, 170), 20, 265);
    
    doc.save(`Invoice_${client || 'Draft'}.pdf`);
  };

  if (isLocked) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'monospace' }}>
        <div style={{ background: '#111', padding: '50px', borderRadius: '10px', border: '1px solid #333', textAlign: 'center', boxShadow: '0 0 30px #000' }}>
          <h1 style={{ color: '#38bdf8', marginBottom: '10px' }}>SYSTEM LOCKED</h1>
          <p style={{ opacity: 0.6 }}>RCL INTEGRATED VENTURES LLC | SECURE ACCESS</p>
          <input 
            type="text" 
            placeholder="XXXX-XXXX-XXXX" 
            style={{ width: '100%', padding: '15px', margin: '20px 0', background: '#000', border: '1px solid #444', color: '#38bdf8', textAlign: 'center', fontSize: '1.2rem' }}
            onChange={(e) => setLicenseKey(e.target.value)}
          />
          <button onClick={handleUnlock} style={{ width: '100%', padding: '15px', background: '#38bdf8', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>INITIALIZE ACTIVATION</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#e2e8f0', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: 'auto', background: '#111827', padding: '40px', borderRadius: '15px', border: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#38bdf8', margin: 0 }}>INVOICE BUILDER PRO <span style={{ fontSize: '12px', color: '#64748b' }}>v2.0.0</span></h1>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>RCL INTEGRATED VENTURES LLC</div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>CLIENT INFORMATION</label>
          <input type="text" placeholder="Client Name or Business" style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} onChange={(e) => setClient(e.target.value)} />
        </div>

        <div style={{ marginBottom: '10px', color: '#94a3b8', display: 'flex' }}>
          <div style={{ flex: 3 }}>SERVICE DESCRIPTION</div>
          <div style={{ flex: 1 }}>QTY</div>
          <div style={{ flex: 1 }}>PRICE</div>
        </div>

        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <input type="text" placeholder="Describe service..." style={{ flex: 3, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px' }} value={item.desc} onChange={(e) => updateItem(index, 'desc', e.target.value)} />
            <input type="number" style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px' }} value={item.qty} onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)} />
            <input type="number" style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px' }} value={item.price} onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)} />
          </div>
        ))}

        <button onClick={addItem} style={{ background: 'none', border: '1px dashed #334155', color: '#38bdf8', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '30px' }}>+ ADD LINE ITEM</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '30px' }}>
          <div style={{ width: '50%' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>LEGAL TERMS & CONDITIONS</label>
            <textarea style={{ width: '100%', height: '80px', background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', fontSize: '11px', padding: '10px', borderRadius: '5px' }} value={legalTerms} onChange={(e) => setLegalTerms(e.target.value)} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '10px' }}>Tax Rate (%): <input type="number" style={{ width: '60px', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '5px' }} value={taxRate} onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)} /></div>
            <div style={{ fontSize: '18px' }}>Subtotal: ${subtotal.toFixed(2)}</div>
            <div style={{ fontSize: '28px', color: '#10b981', fontWeight: 'bold', marginTop: '10px' }}>TOTAL: ${grandTotal.toFixed(2)}</div>
          </div>
        </div>

        <button onClick={downloadPDF} style={{ width: '100%', marginTop: '40px', padding: '20px', background: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '18px' }}>GENERATE PRO INVOICE</button>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#475569', fontSize: '12px' }}>
        © 2026 RCL INTEGRATED VENTURES LLC. All rights reserved. | Software Version 2.0.0-PRO
      </footer>
    </div>
  );
}

export default App;
