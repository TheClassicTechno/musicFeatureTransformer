import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');

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
      const response = await fetch('http://localhost:8000/process', {
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
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Music AI - Audio Processor</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={!file || processing}>
        {processing ? 'Processing...' : 'Upload & Process'}
      </button>
      <br /><br />
      {downloadUrl && (
        <a href={downloadUrl} download="processed_audio.wav">
          <button>Download Processed Audio</button>
        </a>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default App;
