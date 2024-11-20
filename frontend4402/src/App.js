import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
import AddMember from "./componets/AddMember.js";
import ClassManagement from "./componets/ClassManagement.js";
import Notifications from "./componets/Notifications.js";
import Header from "./componets/Header";
import HomePage from "./componets/HomePage.js";
import {
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from "@mui/material"; // Import Material-UI components
import PropTypes from "prop-types"; // Import PropTypes for type checking

// SQL Executor Component
function SQLExecutor() {
  const [message, setMessage] = useState("");
  const [sql, setSql] = useState("");
  const [result, setResult] = useState([]); // State to store the API response

  useEffect(() => {
    // API call to http://localhost:8080/api/hello
    axios
      .get("http://localhost:8080/api/hello")
      .then((response) => setMessage(response.data))
      .catch((error) =>
        setMessage(
          "Error connecting to backend and database.\nPlease make sure backend is up and running at " +
            "http://localhost:8080.\nIf it is not, open the backend4402 folder in IntelliJ (or another IDE) and " +
            "run the main class in Example4402Application."
        )
      );
  }, []);

  const handleExecuteSQL = () => {
    axios
      .post("http://localhost:8080/api/sql", { sql: sql }) // sql is the argument accepted by the backend
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error("Error executing SQL statement:", error);
        setResult([]);
      });
  };

  const handleSQLChange = (e) => {
    setSql(e.target.value);
  };

  return (
    <div style={containerStyle}>
      <h1>SQL Executor</h1>
      <div style={example}>{message}</div>
      <label>SQL Statement:</label>
      <textarea
        style={textAreaStyle}
        value={sql}
        onChange={handleSQLChange}
      />
      <button onClick={handleExecuteSQL} style={buttonStyle}>
        Execute SQL
      </button>
      <div>
        <h4>SQL Result:</h4>
        {result.map((item, index) => (
          <div key={index}>
            <pre
              style={{
                whiteSpace: "pre-line",
                fontSize: "12px",
                padding: "8px",
                border: "1px solid #ccc",
                width: "100%",
                borderRadius: "5px",
              }}
            >
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      <div style={example}>
        <p>Example statements to try:</p>
        <p>SELECT * FROM EMPLOYEE</p>
        <p>
          INSERT INTO Employee (FirstName, LastName, Department, Salary) VALUES
          ('Jim', 'Halpert', 'Sales', 45000.00);
        </p>
      </div>
    </div>
  );
}

// TabPanel Component for Tab Content Management
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function App() {
  const [notifications, setNotifications] = useState([
    "New class scheduled: Yoga at 5 PM",
    "Reminder: Membership fees due tomorrow",
    "Don't forget to log attendance!",
  ]);

  return (
    <Router>
      <Header unreadCount={notifications.length} />
      <Routes>
        <Route
          path="/"
          element={<HomePage notifications={notifications} />}
        />
        <Route
          path="/AddMember"
          element={
            <ClassManagement setNotifications={setNotifications} />
          }
        />
        <Route path="/ClassManagement" element={<AddMember />} />
        <Route
          path="/Notifications"
          element={
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
            />
          }
        />
        <Route path="/SQLExecutor" element={<SQLExecutor />} />
      </Routes>
    </Router>
  );
}

// Shared styles
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontFamily: "monospace",
  fontSize: "1.2rem",
  textAlign: "center",
  marginTop: "50px",
};

const textAreaStyle = {
  width: "30%",
  minHeight: "10%",
  padding: "10px",
  margin: "20px",
  resize: "none",
  overflowY: "auto",
};

const example = {
  width: "40%",
  minHeight: "10%",
  maxWidth: "50%",
  padding: "10px",
  fontSize: "1rem",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default App;
