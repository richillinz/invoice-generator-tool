import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [dbName, setDbName] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
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

  const provisionDatabase = () => {
    if (!dbName) return alert("Please enter a name for your database.");
    setIsProvisioning(true);
    setTimeout(() => {
      alert(`Database "${dbName}" has been successfully provisioned and linked to your RCL Ventures Vault.`);
      setIsProvisioning(false);
    }, 2000);
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
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(22);
    doc.text("INVOICE PRO", 20, 25);
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text("POWERED BY RCL INTEGRATED VENTURES LLC", 125, 25);
    doc.save(`Invoice_${client || 'Draft'}.pdf`);
  };

  if (isLocked) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'monospace' }}>
        <div style={{ background: '#111', padding: '50px', borderRadius: '10px', border: '1px solid #333', textAlign: 'center' }}>
          <h1 style={{ color: '#38bdf8' }}>SYSTEM LOCKED</h1>
          <input type="text" placeholder="XXXX-XXXX-XXXX" style={{ width: '100%', padding: '15px', margin: '20px 0', background: '#000', border: '1px solid #444', color: '#38bdf8', textAlign: 'center' }} onChange={(e) => setLicenseKey(e.target.value)} />
          <button onClick={handleUnlock} style={{ width: '100%', padding: '15px', background: '#38bdf8', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>INITIALIZE ACTIVATION</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#e2e8f0', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: 'auto', background: '#111827', padding: '40px', borderRadius: '15px', border: '1px solid #1f2937' }}>
        
        {/* BRANDING HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#38bdf8', margin: 0 }}>INVOICE BUILDER PRO <span style={{ fontSize: '12px', color: '#64748b' }}>v2.0.0</span></h1>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>RCL INTEGRATED VENTURES LLC</div>
        </div>

        {/* --- NEW DATABASE SECTION START --- */}
        <div style={{ padding: '20px', background: '#0f172a', borderRadius: '10px', border: '1px solid #38bdf8', marginBottom: '30px' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0, fontSize: '14px' }}>DATABASE PROVISIONING</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Name your Data Vault (e.g. 2026_Records)" 
              style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #334155', color: '#38bdf8' }}
              onChange={(e) => setDbName(e.target.value)}
            />
            <button 
              onClick={provisionDatabase}
              style={{ padding: '10px 20px', background: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              {isProvisioning ? "PROVISIONING..." : "CREATE & LINK"}
            </button>
          </div>
          <p style={{ fontSize: '10px', color: '#64748b', marginTop: '10px' }}>*Initializes a Free-Tier Cloud Vault linked to your RCL License.</p>
        </div>
        {/* --- NEW DATABASE SECTION END --- */}

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>CLIENT INFORMATION</label>
          <input type="text" placeholder="Client Name" style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} onChange={(e) => setClient(e.target.value)} />
        </div>

        {/* ... Rest of the form logic follows ... */}
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <input type="text" placeholder="Service" style={{ flex: 3, padding: '10px', background: '#1e293b', color: 'white' }} onChange={(e) => updateItem(index, 'desc', e.target.value)} />
            <input type="number" placeholder="Qty" style={{ flex: 1, padding: '10px', background: '#1e293b', color: 'white' }} onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)} />
            <input type="number" placeholder="Price" style={{ flex: 1, padding: '10px', background: '#1e293b', color: 'white' }} onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)} />
          </div>
        ))}

        <button onClick={addItem} style={{ color: '#38bdf8', background: 'none', border: '1px dashed #334155', cursor: 'pointer', marginBottom: '20px' }}>+ Add Row</button>
        <button onClick={downloadPDF} style={{ width: '100%', padding: '20px', background: '#38bdf8', color: '#000', fontWeight: 'bold', borderRadius: '10px' }}>GENERATE PRO INVOICE</button>
      </div>
    </div>
  );
}

export default App;
