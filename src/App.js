import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import { supabase } from './supabaseClient';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [dbName, setDbName] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState('');
  const [currency, setCurrency] = useState('$');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);

  const deviceID = window.navigator.userAgent + window.screen.width;

  useEffect(() => {
    const checkAuth = async () => {
      const savedKey = localStorage.getItem('active_license');
      if (savedKey) {
        const { data } = await supabase.from('activations').select('*').eq('license_key', savedKey).single();
        if (data && data.device_fingerprint === deviceID) setIsLocked(false);
      }
    };
    checkAuth();
  }, [deviceID]);

  const handleUnlock = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('activations').select('*').eq('license_key', licenseKey).single();
    
    if (data) {
      if (!data.device_fingerprint || data.device_fingerprint === deviceID) {
        if (!data.device_fingerprint) {
          await supabase.from('activations').update({ device_fingerprint: deviceID }).eq('id', data.id);
        }
        localStorage.setItem('active_license', licenseKey);
        setIsLocked(false);
      } else {
        alert("ACCESS DENIED: Key locked to another device. Contact RCL Support.");
      }
    } else {
      alert("INVALID KEY: Not found in RCL Ledger.");
    }
    setLoading(false);
  };

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const grandTotal = subtotal + (subtotal * (taxRate / 100));

  const downloadPDF = async () => {
    // 1. GENERATE PDF
    const doc = new jsPDF();
    doc.text("INVOICE PRO", 20, 20);
    doc.text(`Client: ${client}`, 20, 40);
    doc.text(`Total: ${currency}${grandTotal.toFixed(2)}`, 20, 60);

    // 2. AUTO-SAVE TO SUPABASE
    const { error } = await supabase.from('invoices').insert([{
      license_key: localStorage.getItem('active_license'),
      client_name: client,
      total_amount: grandTotal,
      invoice_data: { items, currency, taxRate }
    }]);

    if (error) console.error("Cloud Save Failed:", error.message);
    
    // 3. DOWNLOAD
    doc.save(`Invoice_${client || 'RCL'}.pdf`);
  };

  if (isLocked) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8', fontFamily: 'monospace' }}>
        <div style={{ border: '1px solid #333', padding: '40px', textAlign: 'center' }}>
          <h1>RCL SECURE PORTAL</h1>
          <input type="text" placeholder="XXXX-XXXX-XXXX" style={{ background: '#000', border: '1px solid #333', color: '#38bdf8', padding: '15px' }} onChange={(e) => setLicenseKey(e.target.value)} />
          <button onClick={handleUnlock} style={{ display: 'block', margin: '20px auto', padding: '10px 20px', cursor: 'pointer', background: '#38bdf8', fontWeight: 'bold' }}>{loading ? "VERIFYING..." : "AUTHORIZE"}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', background: '#111827', padding: '30px', borderRadius: '15px', border: '1px solid #1f2937' }}>
        <h1 style={{ color: '#38bdf8' }}>RCL INTEGRATED VENTURES</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
          <input type="text" placeholder="Client Name" style={{ padding: '10px', background: '#1e293b', border: 'none', color: 'white' }} onChange={(e) => setClient(e.target.value)} />
          <select style={{ background: '#1e293b', color: 'white', border: 'none' }} onChange={(e) => setCurrency(e.target.value)}>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
          </select>
        </div>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="Service" style={{ flex: 3, padding: '8px' }} onChange={(e) => updateItem(index, 'desc', e.target.value)} />
            <input type="number" placeholder="Qty" style={{ flex: 1, padding: '8px' }} onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)} />
            <input type="number" placeholder="Price" style={{ flex: 1, padding: '8px' }} onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)} />
          </div>
        ))}
        <button onClick={addItem} style={{ background: 'none', color: '#38bdf8', border: '1px dashed #333', padding: '10px', cursor: 'pointer' }}>+ ADD ROW</button>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <h2 style={{ color: '#10b981' }}>TOTAL: {currency}{grandTotal.toFixed(2)}</h2>
          <button onClick={downloadPDF} style={{ width: '100%', padding: '20px', background: '#38bdf8', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}>GENERATE & SAVE TO VAULT</button>
        </div>
      </div>
    </div>
  );
}

export default App;
