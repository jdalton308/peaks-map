
<template>
  <div id="app">
    <h1>Peaks Power</h1>

    <div>
      Highest 1m average: {{one.average}}
    </div>
    <div>
      Highest 5m average: {{five.average}}
    </div>
    <div>
      Highest 10m average: {{ten.average}}
    </div>
    <div>
      Highest 15m average: {{fifteen.average}}
    </div>
    <div>
      Highest 20m average: {{twenty.average}}
    </div>

    <workout-map
      :path="workoutPath"
      :highlightedPath="selectionPath"
      :marker="hoverMarker"
    ></workout-map>

    <workout-chart
      name="Power Output"
      yLabel="Power (W)"
      :chartData="chartData"
      :onChartSelection="onChartSelection"
      :onDataHover="onChartHover"
      :onChartLeave="onChartLeave"
    ></workout-chart>
  </div>
</template>



<script>
import WorkoutMap from './components/workout-map.vue';
import WorkoutChart from './components/workout-chart.vue';

import WO_DATA from './data/workout-data.json';
import {
  getWorkoutLatLng,
  getWorkoutTimePower,
  getMaxPowerAverage,
} from './data/utils.js';

const accessToken = 'pk.eyJ1IjoiamRhbHRvbjMwOCIsImEiOiJjamZrbDl4c3UwNzNhMnhvNHN1NnE3NWRlIn0.R1lA0RhpM4caRNQlKBMsHQ';

// TODO:
// - Create appropriate components
// - Style interface
// - Display best power intervals
//    - Add affordance to toggle power intervals on map, and maybe chart
// - Move util functions (ie getAverage()) to own file
// - Style chart
// - Style map (a little)

// - Show loader for at least 1s while calculations occur
// - Add hover to map workout path
// - Style the chart hover bubble
// - Add other data to chart


export default {
  name: 'app',
  components: {
    WorkoutMap,
    WorkoutChart,
  },
  data() {
    return {
      // Map
      workoutPath: [],
      selectionPath: [],
      hoverMarker: null,

      // Chart
      chartData: [],

      // Max Data
      one: {},
      five: {},
      ten: {},
      fifteen: {},
      twenty: {},
    }
  },
  computed: {
  },
  methods: {

    onChartSelection(e) {
      if (e.xAxis) {
        // Draw new highlighted path
        //-----
        this.selectionMin = e.xAxis[0].min;
        this.selectionMax = e.xAxis[0].max;

        // Draw polyline of selected data, on top of full path
        const startIndex = Math.round(this.selectionMin/1000);
        const endIndex = Math.round(this.selectionMax/1000);
        const selectionData = WO_DATA.samples.slice(startIndex, endIndex);
        const selectionLatLng = [];

        selectionData.forEach((sample) => {
          if (sample.values.positionLat) {
            selectionLatLng.push([sample.values.positionLat, sample.values.positionLong]);
          }
        });

        this.selectionPath = selectionLatLng;

      } else {
        // Selection was reset, so clear highlighted path
        //-----
        this.selectionMin = null;
        this.selectionMax = null;
        this.selectionPath = [];
      }
    },

    onChartHover(e) {
      // Highlight point on map
      const hoverPoint = parseInt(e.target.category);
      const dataPoint = WO_DATA.samples.find((sample) => (sample.millisecondOffset === hoverPoint));

      if (dataPoint.values.positionLat) {
        this.hoverMarker = [dataPoint.values.positionLat, dataPoint.values.positionLong];
      }
    },

    onChartLeave(e) {
      this.hoverMarker = null;
    },
  },

  beforeMount: function() {
    const {samples} = WO_DATA;

    // Store best 1, 5, 10, 15, and 20 minute "best" efforts
    this.one = getMaxPowerAverage(1, samples);
    this.five = getMaxPowerAverage(5, samples);
    this.ten = getMaxPowerAverage(10, samples);
    this.fifteen = getMaxPowerAverage(15, samples);
    this.twenty = getMaxPowerAverage(20, samples);

    // Initialize Map
    this.workoutPath = getWorkoutLatLng(samples);

    // Initialize Chart
    this.chartData = getWorkoutTimePower(samples);
  },
}

</script>



<style lang="scss">



</style>
