import React, { useState, useEffect } from "react";
import QRScanner from "./components/QRScanner";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setTasks(parsed);
      } else {
        setTasks([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Aufgaben nach Status filtern
  const todo = tasks.filter((task) => task.status === "todo");
  const inProgress = tasks.filter((task) => task.status === "inProgress");
  const done = tasks.filter((task) => task.status === "done");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>📋 QR-Kanban-Board</h1>

      {/* QR Scanner */}
      <QRScanner />

      {/* Kanban-Board */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
        {/* To Do */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h2>📝 To Do</h2>
          {todo.map((task) => (
            <div key={task.id} style={cardStyle}>
              {task.title}
            </div>
          ))}
        </div>

        {/* In Progress */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h2>⚙️ In Bearbeitung</h2>
          {inProgress.map((task) => (
            <div key={task.id} style={cardStyle}>
              {task.title}
            </div>
          ))}
        </div>

        {/* Done */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h2>✅ Erledigt</h2>
          {done.map((task) => (
            <div key={task.id} style={cardStyle}>
              {task.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Kartenstil
const cardStyle = {
  background: "#f0f0f0",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

export default App;
