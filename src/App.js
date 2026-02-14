import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [dbName, setDbName] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [client, setClient] = useState('');
  const [currency, setCurrency] = useState('$');
  const [status, setStatus] = useState('Draft');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [legalTerms, setLegalTerms] = useState('Payment is due within 30 days. RCL Integrated Ventures standard terms apply.');

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
    if (!dbName) return alert("Please name your database.");
    setIsProvisioning(true);
    setTimeout(() => {
      alert(`Vault "${dbName}" initialized.`);
      setIsProvisioning(false);
    }, 1500);
  };

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const grandTotal = subtotal + (subtotal * (taxRate / 100));

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(22);
    doc.text("INVOICE PRO", 20, 25);
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`STATUS: ${status.toUpperCase()}`, 155, 25);

    doc.setTextColor(0);
    doc.text(`Client: ${client}`, 20, 55);
    doc.text(`Currency: ${currency}`, 155, 55);
    
    let y = 80;
    items.forEach(item => {
      doc.text(`${item.desc} (x${item.qty})`, 20, y);
      doc.text(`${currency}${item.qty * item.price}`, 170, y);
      y += 10;
    });

    doc.text(`TOTAL: ${currency}${grandTotal.toFixed(2)}`, 150, y + 20);
    doc.setFontSize(8);
    doc.text(doc.splitTextToSize(legalTerms, 170), 20, 270);
    doc.save(`Invoice_${client}.pdf`);
  };

  if (isLocked) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8' }}>
        <div style={{ border: '1px solid #333', padding: '40px', textAlign: 'center' }}>
          <h2>ACCESS RESTRICTED</h2>
          <input type="text" placeholder="XXXX-XXXX-XXXX" style={{ background: '#000', border: '1px solid #333', color: '#38bdf8', padding: '10px', display: 'block', margin: '20px auto' }} onChange={(e) => setLicenseKey(e.target.value)} />
          <button onClick={handleUnlock} style={{ background: '#38bdf8', color: '#000', padding: '10px 20px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>UNLOCK SYSTEM</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#0a0a0c', color: '#e2e8f0', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: 'auto', background: '#111827', padding: '30px', borderRadius: '12px' }}>
        
        {/* TOP BRANDING & STATUS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #1f2937', paddingBottom: '10px' }}>
          <div>
            <h1 style={{ color: '#38bdf8', margin: 0 }}>RCL INTEGRATED VENTURES</h1>
            <span style={{ fontSize: '10px', color: '#64748b' }}>ENTERPRISE INVOICE SUITE v2.1.0</span>
          </div>
          <select style={{ background: '#0f172a', color: '#38bdf8', border: '1px solid #334155', padding: '5px' }} onChange={(e) => setStatus(e.target.value)}>
            <option>Draft</option>
            <option>Sent</option>
            <option>Paid</option>
          </select>
        </div>

        {/* PROVISIONING BLOCK */}
        <div style={{ background: '#0f172a', padding: '15px', border: '1px solid #38bdf8', marginBottom: '20px' }}>
          <label style={{ fontSize: '10px', color: '#38bdf8' }}>CLOUD DATA VAULT</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Vault Name..." style={{ flex: 1, background: '#000', color: '#fff', border: '1px solid #334155', padding: '8px' }} onChange={(e) => setDbName(e.target.value)} />
            <button onClick={provisionDatabase} style={{ background: '#38bdf8', padding: '0 15px' }}>{isProvisioning ? '...' : 'LINK'}</button>
          </div>
        </div>

        {/* CONFIGURATION GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>CLIENT</label>
            <input type="text" style={{ width: '100%', padding: '10px', background: '#1e293b', border: 'none', color: 'white' }} onChange={(e) => setClient(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>CURRENCY</label>
            <select style={{ width: '100%', padding: '10px', background: '#1e293b', border: 'none', color: 'white' }} onChange={(e) => setCurrency(e.target.value)}>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
            </select>
          </div>
        </div>

        {/* ITEM LIST */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>LINE ITEMS</label>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input type="text" placeholder="Service..." style={{ flex: 3, padding: '10px', background: '#1e293b', color: 'white', border: 'none' }} onChange={(e) => updateItem(index, 'desc', e.target.value)} />
              <input type="number" placeholder="Qty" style={{ flex: 1, padding: '10px', background: '#1e293b', color: 'white', border: 'none' }} onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)} />
              <input type="number" placeholder="Price" style={{ flex: 1, padding: '10px', background: '#1e293b', color: 'white', border: 'none' }} onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)} />
            </div>
          ))}
          <button onClick={addItem} style={{ background: 'none', border: '1px dashed #334155', color: '#38bdf8', padding: '10px', marginTop: '10px', cursor: 'pointer' }}>+ ADD ROW</button>
        </div>

        {/* LEGAL & TAX (The fix is the margin-bottom here) */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px', marginBottom: '50px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>LEGAL TERMS & CONDITIONS</label>
          <textarea style={{ width: '100%', height: '60px', background: '#0f172a', color: '#94a3b8', padding: '10px', border: '1px solid #334155' }} value={legalTerms} onChange={(e) => setLegalTerms(e.target.value)} />
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
             Tax Rate: <input type="number" style={{ width: '50px', background: '#000', color: '#fff' }} onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)} /> %
             <h2 style={{ color: '#10b981' }}>TOTAL: {currency}{grandTotal.toFixed(2)}</h2>
          </div>
        </div>

        <button onClick={downloadPDF} style={{ width: '100%', padding: '20px', background: '#38bdf8', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>DOWNLOAD ENTERPRISE INVOICE</button>
        
        {/* FOOTER - Anchored so it won't disappear */}
        <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '20px', color: '#475569', fontSize: '10px' }}>
          RCL INTEGRATED VENTURES LLC | SECURE CLOUD SERVICE
        </div>
      </div>
    </div>
  );
}

export default App;
