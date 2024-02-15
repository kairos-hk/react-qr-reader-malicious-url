import React, { useState } from "react";
import QrReader from "react-qr-reader";
import "./styles.css";

const App = () => {
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [isMalicious, setIsMalicious] = useState(false);

  const handleScan = async (scanData) => {
    if (scanData) {
      setLoadingScan(true);
      console.log(`Scanned data:`, scanData);

      const url = `http://kairoshk.ddns.net:5000/url/ai/?data=${encodeURIComponent(scanData)}`;

      try {
        const response = await fetch(url);
        const { result } = await response.json();

        if (result === 0) {
          setIsMalicious(false);
        } else if (result === 1) {
          setIsMalicious(true);
        }
      } catch (err) {
        console.error("Error checking URL:", err);
      } finally {
        setLoadingScan(false);
        setStartScan(false);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  return (
    <div className="App">
      <h1>악성 URL 탐지 <hr></hr> QR Code Reader</h1>
      <br></br>
      <button onClick={() => setStartScan(!startScan)}>
        {startScan ? "Stop Scan" : "Start Scan"}
      </button>

      {startScan && (
        <>
          <select onChange={(e) => setSelected(e.target.value)} className="camera-select">
            <option value="environment">Back Camera</option>
            <option value="user">Front Camera</option>
          </select>
          <QrReader
            facingMode={selected}
            delay={1000}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "300px" }}
          />
        </>
      )}

      {loadingScan && <p>Loading...</p>}
      {isMalicious && (
        <div className="warning-overlay">
          <div className="warning-icon">⚠️</div>
          <p>악성 URL 탐지됨!</p>
        </div>
      )}
    </div>
  );
};

export default App;
