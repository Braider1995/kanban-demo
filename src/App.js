import { useState } from "react";
import QRScanner from "./components/QRScanner";

function App() {
  const [board, setBoard] = useState({
    todo: [],
    in_progress: [],
    done: []
  });

  const columns = ["todo", "in_progress", "done"];

  function handleScan(qrCodeText) {
    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const index = newBoard[col].findIndex((c) => c.id === qrCodeText);

        if (index !== -1) {
          if (i < columns.length - 1) {
            const [card] = newBoard[col].splice(index, 1);
            newBoard[columns[i + 1]].push(card);
          }
          return newBoard;
        }
      }

      newBoard["todo"].push({ id: qrCodeText, title: qrCodeText });
      return newBoard;
    });
  }

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div>
        <h2>QR-Code Scanner</h2>
        <QRScanner onScan={handleScan} />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {columns.map((col) => (
          <div key={col}>
            <h3>{col.replace("_", " ").toUpperCase()}</h3>
            {board[col].map((card) => (
              <div
                key={card.id}
                style={{
                  border: "1px solid gray",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  backgroundColor: "#f0f0f0"
                }}
              >
                {card.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
