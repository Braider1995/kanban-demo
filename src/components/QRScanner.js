import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ref, get, push, update } from "firebase/database";
import { db } from "../firebase";

const QRScanner = () => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    const startScanner = async () => {
      if (isScanningRef.current) return;
      isScanningRef.current = true;

      try {
        await html5QrCodeRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            console.log("✅ Gescannt:", decodedText);
            await html5QrCodeRef.current.stop();
            isScanningRef.current = false;

            // 🔄 In Firebase speichern oder Status ändern
            const tasksRef = ref(db, "tasks");
            const snapshot = await get(tasksRef);
            const data = snapshot.val();
            let foundKey = null;
            let foundTask = null;

            if (data) {
              for (const [key, task] of Object.entries(data)) {
                if (task.title === decodedText) {
                  foundKey = key;
                  foundTask = task;
                  break;
                }
              }
            }

            if (foundKey) {
              let nextStatus = "done";
              if (foundTask.status === "todo") nextStatus = "inProgress";
              if (foundTask.status === "inProgress") nextStatus = "done";

              await update(ref(db, `tasks/${foundKey}`), { status: nextStatus });
            } else {
              await push(tasksRef, { title: decodedText, status: "todo" });
            }

            // Nach kurzem Delay Scanner neu starten
            setTimeout(() => {
              startScanner();
            }, 1500);
          },
          (errorMessage) => {
            // Fehler ignorieren
          }
        );
      } catch (err) {
        console.error(err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div>
      <h2>📷 QR-Code scannen</h2>
      <div id="qr-reader" style={{ width: "300px", margin: "auto" }}></div>
    </div>
  );
};

export default QRScanner;


