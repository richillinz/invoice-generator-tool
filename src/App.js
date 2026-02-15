import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const deviceID = window.navigator.userAgent + window.screen.width;

  const handleUnlock = async () => {
    setLoading(true);
    // 1. Ask Supabase for the key
    const { data, error } = await supabase
      .from('activations')
      .select('*')
      .eq('license_key', licenseKey.trim())
      .single();

    if (error) {
      // If there is a connection error, it will pop up here
      alert("Database Error: " + error.message);
    } else if (data) {
      // 2. Check the hardware lock
      if (!data.device_fingerprint || data.device_fingerprint === deviceID) {
        if (!data.device_fingerprint) {
          await supabase.from('activations').update({ device_fingerprint: deviceID }).eq('id', data.id);
        }
        localStorage.setItem('active_license', licenseKey);
        setIsLocked(false);
      } else {
        alert("SECURITY ALERT: Key is locked to another device.");
      }
    } else {
      alert("INVALID KEY: Not found in RCL Ledger.");
    }
    setLoading(false);
  };

  if (isLocked) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8' }}>
        <div style={{ border: '1px solid #333', padding: '40px', textAlign: 'center' }}>
          <h2>RCL SECURE PORTAL</h2>
          <input 
            type="text" 
            placeholder="ENTER MASTER KEY" 
            style={{ background: '#000', border: '1px solid #333', color: '#38bdf8', padding: '10px' }} 
            onChange={(e) => setLicenseKey(e.target.value)} 
          />
          <button onClick={handleUnlock} style={{ marginTop: '15px', display: 'block', width: '100%' }}>
            {loading ? "VERIFYING..." : "AUTHORIZE"}
          </button>
        </div>
      </div>
    );
  }

  return <div style={{ color: 'white', padding: '50px' }}><h1>UNLOCKED: Welcome Admin</h1></div>;
}

export default App;
