import React, { useState } from "react";
import VerticalStepper from "./components/VerticalStepper";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [stationNum, setStationNum] = useState("");
  const [stations, setStations] = useState([]);
  const searchHandler = () => {
    console.log(stationNum);
    axios
      .get(`http://localhost:8080/api/train/live-status/${stationNum}`)
      .then((response) => {
        setStations(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.error)
      });
    setStationNum("");
  };

  return (
    <div className="container h-screen flex flex-col items-center justify-center">
       <Toaster />
      <div>
        <TextField
          id="outlined-basic"
          label="Station Name"
          variant="outlined"
          value={stationNum}
          onChange={(e) => setStationNum(e.target.value)}
        />
        <Button variant="contained" onClick={searchHandler}>
          Search
        </Button>
      </div>
      <VerticalStepper stations={stations} />
    </div>
  );
};

export default App;
