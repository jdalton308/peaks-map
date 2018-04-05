
<template>

<div id="app">
  <PeaksHeader></PeaksHeader>

  <div class="map-row">
    <div class="map-container">
      <workout-map
        :path="workoutPath"
      ></workout-map>
    </div>

    <workout-power-panel></workout-power-panel>
  </div>

  <workout-chart
    name="Power Output"
    yLabel="Power (W)"
    :chartData="chartData"
  ></workout-chart>
</div>

</template>



<script>

import PeaksHeader from './components/peaks-header.vue';
import WorkoutMap from './components/workout-map.vue';
import WorkoutChart from './components/workout-chart.vue';
import WorkoutPowerPanel from './components/workout-power-panel.vue';

import WO_DATA from './data/workout-data.json';
import {
  getWorkoutLatLng,
  getWorkoutTimePower,
} from './utils/utils.js';


export default {
  name: 'app',
  components: {
    PeaksHeader,
    WorkoutMap,
    WorkoutChart,
    WorkoutPowerPanel,
  },

  data() {
    return {
      // Map
      workoutPath: [],

      // Chart
      chartData: [],
    }
  },

  beforeMount: function() {
    const {samples} = WO_DATA;

    // Initialize Map
    this.workoutPath = getWorkoutLatLng(samples);0

    // Initialize Chart
    this.chartData = getWorkoutTimePower(samples);
  },
}

</script>



<style lang="scss">

@import './assets/style/_variables.scss';

.map-row {
  display: flex;
  height: 50vh;
  min-height: 300px;

  .map-container {
    display: inline-block;
    flex: 2;
    position: relative;
    z-index: 0;
    box-shadow: 0 0 5px $grey-dark;
  }
}

</style>
