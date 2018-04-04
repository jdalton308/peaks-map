
<template>
  <div id="app">
    <h1>Peaks Power</h1>

    <div>
      Highest 20m average: {{twenty.average}}
    </div>
    <div>
      Highest 5m average: {{five.average}}
    </div>

    <div id="map"></div>

    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>



<script>

import DATA from './data/workout-data.json';
import L from 'leaflet';

const accessToken = 'pk.eyJ1IjoiamRhbHRvbjMwOCIsImEiOiJjamZrbDl4c3UwNzNhMnhvNHN1NnE3NWRlIn0.R1lA0RhpM4caRNQlKBMsHQ';

// TODO:
// - Move getAverage() to util file
// - Show loader for at least 1s while calculations occur
// - Highlight each interval (1,5,10,20) on map and chart
//    - Maybe toggle bests on map
// - Add hover to map workout path


export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      twenty: {},
      five: {},
      chartOptions: {
        title: {
          text: 'Power Output',
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: 'Power'
          }
        },
        series: [{
          type: 'line',
          data: this.getWorkoutTimePowerMap(),
          name: 'Power Output'
        }]
      },
    }
  },
  computed: {
  },
  methods: {
    // TODO: move to util file
    getMaxPowerAverage(rangeMinutes) {
      const range = rangeMinutes * 60;
      const {samples} = DATA;

      let workingSum = 0;
      let powerEnd = range - 1;

      // Get sum of initial range
      for (let i = 0; i < range; i++) {
        workingSum += samples[i].values.power;
      }

      let powerSum = workingSum;

      // Figure out the largest range sum
      for (let j = range; j < samples.length; j++) {
        const newVal = samples[j].values.power;
        const droppedVal = samples[j - range].values.power;

        workingSum += (newVal - droppedVal);

        if (workingSum > powerSum) {
          powerSum = workingSum;
          powerEnd = j;
        }
      }

      // Calculate and return average
      return {
        average: (powerSum/range).toFixed(2),
        endPoint: powerEnd,
        range: rangeMinutes
      };
    },

    initializeMap() {
      this.map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: accessToken,
        detectRetina: true,
      }).addTo(this.map);
    },

    getWorkoutLatLng() {
      const {samples} = DATA;
      const latLngs = [];

      samples.forEach((sample) => {
        if (sample.values.positionLat) {
          latLngs.push([sample.values.positionLat, sample.values.positionLong]);
        }
      });

      return latLngs;
    },

    putWorkoutOnMap() {
      const latLngs = this.getWorkoutLatLng();

      this.workoutPath = L.polyline(latLngs, {color: 'red', smoothFactor: 3}).addTo(this.map);
      this.map.fitBounds(this.workoutPath.getBounds());
    },

    getWorkoutTimePowerMap() {
      return DATA.samples.map((sample) => {
        return [sample.millisecondOffset, sample.values.power];
      });
    }
  },
  mounted: function() {
    this.twenty = this.getMaxPowerAverage(20);
    this.five = this.getMaxPowerAverage(5);
    // Store best 1, 5, 10, 15, and 20 minute "best" efforts
    // Highlight each of those intervals on the chart and map

    // Draw map of path
    this.initializeMap();
    this.putWorkoutOnMap();

    // Draw Chart
  }
}

</script>



<style lang="scss">

#map {
  height: 50vh;
  width: 50vw;
}

</style>
