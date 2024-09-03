import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";


Chart.register(...registerables);

function App() {
  const [show, setShow] = useState(false);
  const [points, setPoints] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [displayPoints, setDisplayPoints] = useState([]);
  const [error, setError] = useState("");

  const handleError = () => {
    setError(""); 
  };
  
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const addPoint = async () => {
    try {
      // const response = await axios.post(
      //   "/api/prices",
      //   {
      //     value: parseFloat(input),
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      const response = await axios.post(
        "https://task-1-backend-nxo2.onrender.com/api/prices",
        {
          value: parseFloat(input),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      setPoints([...points, data]);
      setInput("");
      handleClose();
    } catch (error) {
      if (error.status === 400) {
        setError("Error ! Please give price value");
      }
      console.error("Error adding point:", error);
    }
  };

  const getFilteredPoints = () => {
    const now = new Date().getTime();
    let filteredPoints = points;

    if (filter === "10min") {
      filteredPoints = points.filter(
        (point) => now - new Date(point.time).getTime() <= 10 * 60 * 1000
      );
    } else if (filter === "1hour") {
      filteredPoints = points.filter(
        (point) => now - new Date(point.time).getTime() <= 60 * 60 * 1000
      );
    } else if (filter === "1min") {
      filteredPoints = points.filter(
        (point) => now - new Date(point.time).getTime() <= 1 * 60 * 1000
      );
    }

    return filteredPoints;
  };

  const data = {
    labels: displayPoints.map((point) =>
      new Date(point.time).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Price",
        data: displayPoints.map((point) => point.value),
        fill: false,
        backgroundColor: "blue",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // const response = await axios.get("/api/prices");
        const response = await axios.get("https://task-1-backend-nxo2.onrender.com/api/prices");
        setPoints(response.data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const filteredPoints = getFilteredPoints();
    setDisplayPoints([]);
    let index = 0;
    const interval = setInterval(() => {
      if (index < filteredPoints.length - 1) {
        setDisplayPoints((prev) => [...prev, filteredPoints[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [filter, points]);
 
  return (
    <div class="App">
      <h1>Price Analysis Chart</h1>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ width: "80%", height: "80%" }}
      >
        <Line data={data} />
      </div>

      <Button variant="primary" onClick={handleShow}>
        Add New Point
      </Button>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="10min">Last 10 Minutes</option>
        <option value="1hour">Last 1 Hour</option>
        <option value="1min">Last 1 Minute</option>
      </select>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Point</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter price"
              />
            </Form.Group>

            {error && (
              <div
                className="d-flex align-items-center justify-content-between alert alert-warning"
                role="alert"
              >
                <p className="mb-0">Please Enter the price value.</p>
                <button
                  type="button"
                  onClick={handleError}
                  className="btn btn-primary btn-sm ml-3"
                >
                  Close
                </button>
              </div>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addPoint}>
            Add Point
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
