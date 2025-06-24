import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

function QRScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
      },
      (error) => {
        // Fehler ignorieren
      }
    );

    return () => scanner.clear().catch(() => {});
  }, [onScan]);

  return <div id="reader" />;
}

export default QRScanner;
