

import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');
  const [nSteps, setNSteps] = useState(-1);
  const [rate, setRate] = useState(0.85);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    setDownloadUrl(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const params = new URLSearchParams({ n_steps: nSteps, rate });
      const response = await fetch(`http://localhost:8000/process?${params.toString()}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Processing failed');
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError('Error processing file.');
    }
    setProcessing(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        margin: '48px auto',
        padding: 32,
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        fontFamily: 'Inter, Arial, sans-serif',
        border: '1px solid #e0e0e0',
      }}>
        <h1 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 8, letterSpacing: '-1px' }}>
          <span role="img" aria-label="music">🎵</span> Music AI Processor
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 28 }}>
          Upload an audio file, choose your settings, and get creative!
        </p>
        <div style={{ marginBottom: 20 }}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', background: '#fafafa' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, color: '#333' }}>
              Pitch Shift
              <input
                type="number"
                value={nSteps}
                onChange={e => setNSteps(e.target.value)}
                step="0.1"
                style={{ width: '100%', marginTop: 4, padding: 6, borderRadius: 5, border: '1px solid #ccc' }}
              />
              <span style={{ fontSize: 12, color: '#888' }}>semitones</span>
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, color: '#333' }}>
              Time Stretch
              <input
                type="number"
                value={rate}
                onChange={e => setRate(e.target.value)}
                step="0.01"
                style={{ width: '100%', marginTop: 4, padding: 6, borderRadius: 5, border: '1px solid #ccc' }}
              />
              <span style={{ fontSize: 12, color: '#888' }}>1.0 = no change</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || processing}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            background: processing ? '#bbb' : '#4f46e5',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: processing ? 'not-allowed' : 'pointer',
            marginBottom: 18,
            transition: 'background 0.2s',
          }}
        >
          {processing ? 'Processing...' : 'Upload & Process'}
        </button>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={file?.name?.replace(/\.[^/.]+$/, '') + '_processed' + (file?.name?.endsWith('.m4a') ? '.m4a' : '.wav')}
            style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}
          >
            <button
              style={{
                width: '100%',
                padding: '10px 0',
                borderRadius: 8,
                background: '#10b981',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer',
                marginTop: 0,
              }}
            >
              Download Processed Audio
            </button>
          </a>
        )}
        {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</div>}
      </div>
    </div>
  );
}

export default App;
