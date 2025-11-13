import React, { useEffect, useState } from 'react';
import { readData, getRawJson, exportData } from '../utils/storage';

export default function DataViewer() {
  const [data, setData] = useState({});
  const [raw, setRaw] = useState('{}');

  function refresh() {
    setData(readData());
    setRaw(getRawJson());
  }

  useEffect(() => {
    refresh();
  }, []);

  function onCopy() {
    navigator.clipboard.writeText(raw).then(() => {
      alert('JSON copied to clipboard');
    }).catch(() => {
      alert('Copy failed');
    });
  }

  function onDownload() {
    exportData();
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Current runtime data (localStorage)</h3>
      <div style={{ marginBottom: 12 }}>
        <button onClick={refresh} style={{ marginRight: 8 }}>Refresh</button>
        <button onClick={onCopy} style={{ marginRight: 8 }}>Copy JSON</button>
        <button onClick={onDownload}>Download JSON</button>
      </div>

      <div style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12, borderRadius: 6, maxHeight: '60vh', overflow: 'auto' }}>
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
}