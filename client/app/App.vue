
<template>
  <div id="app">
    <h1>Peaks Power</h1>

    <div>
      Highest 20m average: {{twenty.average}}
    </div>
    <div>
      Highest 5m average: {{five.average}}
    </div>

    <workout-map
      :path="workoutPath"
      :highlightedPath="selectionPath"
      :marker="hoverMarker"
    ></workout-map>

    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>



<script>

import DATA from './data/workout-data.json';
import WorkoutMap from './components/workout-map.vue';

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


export default {
  name: 'app',
  components: {
    WorkoutMap,
  },
  data() {
    return {
      workoutPath: [],
      selectionPath: [],
      hoverMarker: null,

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

    // TODO: Pull this method out of component
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

    // CHART METHODS
    //---------
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
      const dataPoint = DATA.samples.find((sample) => (sample.millisecondOffset === hoverPoint));

      if (dataPoint.values.positionLat) {
        this.hoverMarker = [dataPoint.values.positionLat, dataPoint.values.positionLong];
      }
    },

    onChartLeave(e) {
      this.hoverMarker = null;
    },
  },

  mounted: function() {
    this.twenty = this.getMaxPowerAverage(20);
    this.five = this.getMaxPowerAverage(5);
    // Store best 1, 5, 10, 15, and 20 minute "best" efforts

    // Draw map of path
    this.workoutPath = this.getWorkoutLatLng();
  }
}

</script>



<style lang="scss">



</style>
