const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 8080;
app.use(cors());

async function liveStatus(trainNumber) {
  try {
    const { data: html } = await axios.get(
      `https://www.confirmtkt.com/train-running-status/${trainNumber}`
    );
    const $ = cheerio.load(html);
    const stations = [];
    const spanElement = $("#errMsgContainer");

    // Check if the element was found
    if (spanElement.length > 0) {
      // Do something with the element
      console.log(spanElement.text().trim());
    } else {
      console.log('Span element with id "errMsgContainer" not found.');
    }

    $(".rs__station-row").each((index, element) => {
      const stationNameElem = $(element).find(".rs__station-name.ellipsis");
      const stationName = stationNameElem.text().trim();

      const day = $(element).find(".col-xs-3").eq(1).text().trim();

      const arrivalTime = $(element).find(".col-xs-2").eq(0).text().trim();
      const departureTime = $(element).find(".col-xs-2").eq(1).text().trim();

      const delay = $(element).find(".rs__station-delay").text().trim();

      const stationData = {
        stationName: stationName,
        current: false,
        completed: false,
        day: day,
        arrivalTime: arrivalTime,
        departureTime: departureTime,
        delay: delay,
      };

      stations.push(stationData);
    });

    let currentIndex = -1;
    $(".circle.blink").each((index, element) => {
      const currentStationName = $(element)
        .next(".rs__station-name.ellipsis")
        .text()
        .trim();
      const stationIndex = stations.findIndex(
        (station) => station.stationName === currentStationName
      );
      if (stationIndex !== -1) {
        stations[stationIndex].current = true;
        currentIndex = stationIndex;
      }
    });

    if (currentIndex !== -1) {
      for (let i = 0; i < currentIndex; i++) {
        stations[i].completed = true;
      }
    }

    return stations;
  } catch (error) {
    console.error("Error fetching the page:", error);
    throw new Error("Unable to fetch live status");
  }
}

app.get("/api/train/live-status/:trainNumber", async (req, res) => {
  try {
      const trainNumber = req.params.trainNumber;
      console.log(trainNumber);
      const result = await liveStatus(trainNumber);
      console.log(result.length);
      if(result.length < 1){
        return res.status(404).json({ error: 'No live status found for the specified train number' });
      }
      return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
