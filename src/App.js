import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const isAdmin = (licenseKey === "RCL-ADMIN-MASTER-2026");
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple Device Fingerprint (In a real app, use a library like FingerprintJS)
  const deviceID = window.navigator.userAgent + window.screen.width;

  useEffect(() => {
    const checkSavedAuth = async () => {
      const savedKey = localStorage.getItem('active_license');
      if (savedKey) {
        // Verify with Supabase that this device is still authorized
        const { data } = await supabase
          .from('activations')
          .select('*')
          .eq('license_key', savedKey)
          .eq('device_fingerprint', deviceID)
          .single();
        
        if (data) setIsLocked(false);
      }
    };
    checkSavedAuth();
  }, [deviceID]);

  const handleUnlock = async () => {
    setLoading(true);
    
    // 1. Check if the key is already in our database
    const { data: existing } = await supabase
      .from('activations')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (existing) {
      if (existing.device_fingerprint === deviceID) {
        // Correct user returning
        localStorage.setItem('active_license', licenseKey);
        setIsLocked(false);
      } else {
        alert("This license is already linked to another device. Access Denied.");
      }
    } else {
      // 2. New Activation: Link this key to THIS device forever
      const { error } = await supabase
        .from('activations')
        .insert([{ license_key: licenseKey, device_fingerprint: deviceID }]);

      if (error) {
        alert("Activation Failed. Key might be invalid or used.");
      } else {
        localStorage.setItem('active_license', licenseKey);
        setIsLocked(false);
        alert("Success! Device Authorized.");
      }
    }
    setLoading(false);
  };

  // ... (rest of your app code)
  if (isLocked) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8' }}>
        <div style={{ border: '1px solid #333', padding: '40px', textAlign: 'center' }}>
          <h2>RCL SECURE ACTIVATION</h2>
          <input 
            type="text" 
            placeholder="Enter Your Unique Gumroad Key" 
            style={{ background: '#000', border: '1px solid #333', color: '#38bdf8', padding: '10px', width: '250px' }} 
            onChange={(e) => setLicenseKey(e.target.value)} 
          />
          <button onClick={handleUnlock} disabled={loading} style={{ display: 'block', margin: '20px auto', padding: '10px 20px', cursor: 'pointer' }}>
            {loading ? "VERIFYING..." : "AUTHORIZE DEVICE"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white' }}>
      <h1>RCL INTEGRATED VENTURES - UNLOCKED</h1>
      <p>Welcome, Authorized User.</p>
    </div>
  );
}

export default App;
