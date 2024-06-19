import React, { useState, useEffect } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import TrainIcon from '@mui/icons-material/Train';
import axios from 'axios';

function VerticalStepper({stations}) {
  return (
    <div>
      <Stepper orientation="vertical">
        {stations.map((station, index) => (
          <Step key={station.stationName} completed={station.completed}>
            <StepLabel>
              {station.stationName} {station.current && <TrainIcon />}
              <div style={{
                display:'flex',
              }}>
                <div>{`Day: ${station.day}`} </div>
                <div>{`Arrival Time: ${station.arrivalTime}`}</div>
                <div>{`Departure Time: ${station.departureTime}`}</div>
                <div>{`Delay: ${station.delay}`}</div>
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {stations.length > 0 && stations[stations.length - 1].completed && (
        <div>
          <Typography>All steps completed - you're finished</Typography>
        </div>
      )}
    </div>
  );
}

export default VerticalStepper;
