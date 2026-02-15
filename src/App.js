import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import { supabase } from './supabaseClient';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);

  const deviceID = window.navigator.userAgent + window.screen.width;

  useEffect(() => {
    const checkAuth = async () => {
      const savedKey = localStorage.getItem('active_license');
      if (savedKey) {
        const { data } = await supabase
          .from('activations')
          .select('*')
          .eq('license_key', savedKey)
          .single();
        if (data && data.device_fingerprint === deviceID) setIsLocked(false);
      }
    };
    checkAuth();
  }, [deviceID]);

  const handleUnlock = async () => {
    setLoading(true);
    // This query MUST match your Supabase column name: license_key
    const { data, error } = await supabase
      .from('activations')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (data) {
      if (!data.device_fingerprint || data.device_fingerprint === deviceID) {
        // If device isn't locked yet, lock it now
        if (!data.device_fingerprint) {
          await supabase.from('activations').update({ device_fingerprint: deviceID }).eq('id', data.id);
        }
        localStorage.setItem('active_license', licenseKey);
        setIsLocked(false);
      } else {
        alert("SECURITY ALERT: This key is already locked to another device.");
      }
    } else {
      console.error("Database Error or No Match:", error);
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

  const downloadPDF = async () => {
    const doc = new jsPDF();
    doc.text("INVOICE PRO", 20, 20);
    doc.text(`Client: ${client}`, 20, 40);
    
    // Auto-Save logic
    await supabase.from('invoices').insert([{
      license_key: localStorage.getItem('active_license'),
      client_name: client,
      invoice_data: { items }
    }]);

    doc.save(`Invoice_${client || 'RCL'}.pdf`);
  };

  if (isLocked) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8', fontFamily: 'monospace' }}>
        <div style={{ border: '1px solid #333', padding: '40px', textAlign: 'center', background: '#111' }}>
          <h1 style={{ marginBottom: '20px' }}>RCL SECURE PORTAL</h1>
          <input 
            type="text" 
            placeholder="ENTER MASTER KEY" 
            style={{ background: '#000', border: '1px solid #333', color: '#38bdf8', padding: '15px', width: '300px', textAlign: 'center', fontSize: '1.1rem' }} 
            onChange={(e) => setLicenseKey(e.target.value.trim())} 
          />
          <button 
            onClick={handleUnlock} 
            style={{ display: 'block', margin: '20px auto', padding: '15px 30px', cursor: 'pointer', background: '#38bdf8', color: 'black', fontWeight: 'bold', border: 'none' }}
          >
            {loading ? "VERIFYING..." : "AUTHORIZE"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', background: '#111827', padding: '30px', borderRadius: '15px', border: '1px solid #1f2937' }}>
        <h1 style={{ color: '#38bdf8' }}>RCL INTEGRATED VENTURES</h1>
        <input type="text" placeholder="Client Name" style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#1e293b', border: 'none', color: 'white' }} onChange={(e) => setClient(e.target.value)} />
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="Service" style={{ flex: 3, padding: '8px' }} onChange={(e) => updateItem(index, 'desc', e.target.value)} />
            <input type="number" placeholder="Qty" style={{ flex: 1, padding: '8px' }} onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)} />
            <input type="number" placeholder="Price" style={{ flex: 1, padding: '8px' }} onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)} />
          </div>
        ))}
        <button onClick={addItem} style={{ background: 'none', color: '#38bdf8', border: '1px dashed #333', padding: '10px', cursor: 'pointer', marginBottom: '20px' }}>+ ADD ROW</button>
        <button onClick={downloadPDF} style={{ width: '100%', padding: '20px', background: '#38bdf8', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>GENERATE & SAVE TO VAULT</button>
      </div>
    </div>
  );
}

export default App;
