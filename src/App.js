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
    
    // --- HEADER & BRANDING ---
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(22);
    doc.text("INVOICE PRO", 20, 25);
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text("POWERED BY RCL INTEGRATED VENTURES LLC", 125, 25);

    // --- CLIENT & DATE INFO ---
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Client: ${client || 'N/A'}`, 20, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 55);
    
    // --- TABLE HEADERS ---
    doc.setDrawColor(200);
    doc.line(20, 65, 190, 65);
    doc.text("Description", 20, 72);
    doc.text("Qty", 120, 72);
    doc.text("Price", 145, 72);
    doc.text("Total", 170, 72);
    doc.line(20, 75, 190, 75);

    // --- ITEM LOOP (This was missing!) ---
    let y = 85;
    items.forEach(item => {
      doc.text(item.desc || '-', 20, y);
      doc.text(item.qty.toString(), 120, y);
      doc.text(`$${item.price}`, 145, y);
      doc.text(`$${(item.qty * item.price).toFixed(2)}`, 170, y);
      y += 10;
    });

    // --- TOTALS SECTION ---
    doc.line(130, y, 190, y);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, y + 10);
    doc.text(`Tax (${taxRate}%): $${taxTotal.toFixed(2)}`, 140, y + 20);
    doc.setFontSize(14);
    doc.text(`GRAND TOTAL: $${grandTotal.toFixed(2)}`, 135, y + 35);

    // --- LEGAL FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("TERMS & CONDITIONS:", 20, 260);
    doc.text(doc.splitTextToSize(legalTerms, 170), 20, 265);
    
    doc.save(`Invoice_${client || 'Draft'}.pdf`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#e2e8f0', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: 'auto', background: '#111827', padding: '40px', borderRadius: '15px', border: '1px solid #1f2937' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#38bdf8', margin: 0 }}>INVOICE BUILDER PRO <span style={{ fontSize: '12px', color: '#64748b' }}>v2.0.0</span></h1>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>RCL INTEGRATED VENTURES LLC</div>
        </div>

        {/* DATABASE SECTION */}
        <div style={{ padding: '20px', background: '#0f172a', borderRadius: '10px', border: '1px solid #38bdf8', marginBottom: '30px' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0, fontSize: '14px' }}>DATABASE PROVISIONING</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Name your Data Vault" style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #334155', color: '#38bdf8' }} onChange={(e) => setDbName(e.target.value)} />
            <button onClick={provisionDatabase} style={{ padding: '10px 20px', background: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>{isProvisioning ? "PROVISIONING..." : "CREATE & LINK"}</button>
          </div>
        </div>

        {/* CLIENT INFO */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>CLIENT INFORMATION</label>
          <input type="text" placeholder="Client Name" style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} onChange={(e) => setClient(e.target.value)} />
        </div>

        {/* ITEMS LIST */}
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <input type="text" placeholder="Service" style={{ flex: 3, padding: '10px', background: '#1e293b', color: 'white' }} onChange={(e) => updateItem(index, 'desc', e.target.value)} />
            <input type="number" placeholder="Qty" style={{ flex: 1, padding: '10px', background: '#1e293b', color: 'white' }} onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)} />
            <input type="number" placeholder="Price" style={{ flex: 1, padding: '10px', background: '#1e293b', color: 'white' }} onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)} />
          </div>
        ))}

        <button onClick={addItem} style={{ color: '#38bdf8', background: 'none', border: '1px dashed #334155', cursor: 'pointer', marginBottom: '20px', padding: '10px' }}>+ Add Line Item</button>
        
        {/* TOTALS & TAX */}
        <div style={{ textAlign: 'right', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <div style={{ marginBottom: '10px' }}>Tax Rate (%): <input type="number" style={{ width: '60px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} value={taxRate} onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)} /></div>
          <div style={{ fontSize: '24px', color: '#10b981', fontWeight: 'bold' }}>TOTAL: ${grandTotal.toFixed(2)}</div>
        </div>

        <button onClick={downloadPDF} style={{ width: '100%', marginTop: '30px', padding: '20px', background: '#38bdf8', color: '#000', fontWeight: 'bold', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>GENERATE PRO INVOICE</button>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#475569', fontSize: '10px' }}>
        © 2026 RCL INTEGRATED VENTURES LLC | Software v2.0.0
      </footer>
    </div>
  );
}

export default App;
