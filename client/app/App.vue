
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
// - When hover over chart, display point on map
//    - Limit calculation to evey 500ms
// - Style the chart hover bubble


export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      map: null,
      marker: null,
      workoutPath: null,
      selectionMin: null,
      selectionMax: null,
      selectionPath: null,

      twenty: {},
      five: {},
      chartOptions: {
        chart: {
          events: {
            selection: this.onChartSelection,
          },
          zoomType: 'x',
        },
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
          data: this.getWorkoutTimePower(),
          name: 'Power Output',
          events: {
            mouseOut: this.onChartLeave,
          },
          point: {
            events: {
              mouseOver: this.onChartHover,
            }
          }
        }]
      }, // end chartOptions

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

      this.workoutPath = L.polyline(latLngs, {color:'#44AF69', smoothFactor:2}).addTo(this.map);
      this.map.fitBounds(this.workoutPath.getBounds());
    },

    getWorkoutTimePower() {
      return DATA.samples.map((sample) => {
        return [sample.millisecondOffset, sample.values.power];
      });
    },

    onChartSelection(e) {

      if (e.xAxis) {
        // Draw new highlighted path
        //-----
        this.selectionMin = e.xAxis[0].min;
        this.selectionMax = e.xAxis[0].max;

        // Draw polyline of selected data, on top of full path
        const startIndex = Math.round(this.selectionMin/1000);
        const endIndex = Math.round(this.selectionMax/1000);
        const selectionData = DATA.samples.slice(startIndex, endIndex);
        const selectionLatLng = [];

        selectionData.forEach((sample) => {
          if (sample.values.positionLat) {
            selectionLatLng.push([sample.values.positionLat, sample.values.positionLong]);
          }
        });

        this.selectionPath = L.polyline(selectionLatLng, {color:'#F8333C', weight:4, smoothFactor:2}).addTo(this.map);
        this.map.fitBounds(this.selectionPath.getBounds());
      } else {
        // Clear highlighted path
        //-----
        this.selectionMin = null;
        this.selectionMax = null;
        this.selectionPath.remove();
        this.map.fitBounds(this.workoutPath.getBounds());
      }
    },

    onChartHover(e) {
      const hoverPoint = parseInt(e.target.category);
      const dataPoint = DATA.samples.find((sample) => (sample.millisecondOffset === hoverPoint));

      // highlight point on map
      if (dataPoint.values.positionLat) {
        const latLng = [dataPoint.values.positionLat, dataPoint.values.positionLong];

        if (!this.marker) {
          this.marker = L.marker(latLng, {autoPan:true}).addTo(this.map);
        } else {
          this.marker.setLatLng(latLng);
        }
      }
    },

    onChartLeave(e) {
      this.marker.remove();
      this.marker = null;
    }
  },
  mounted: function() {
    this.twenty = this.getMaxPowerAverage(20);
    this.five = this.getMaxPowerAverage(5);
    // Store best 1, 5, 10, 15, and 20 minute "best" efforts

    // Draw map of path
    this.initializeMap();
    this.putWorkoutOnMap();
  }
}

</script>



<style lang="scss">

#map {
  height: 50vh;
  width: 50vw;
}

</style>
