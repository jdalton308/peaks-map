
<template>
  <div id="app">
    <PeaksHeader></PeaksHeader>

    <div class="map-row">
      <div class="map-container">
        <workout-map
          :path="workoutPath"
        ></workout-map>
      </div>

      <div class="controls">
        <div class="controls-title">
          <h2>Workout Name</h2>
          <div class="custom-select">
            <select name="data-category" id="data-category" class="data-category">
              <option value="power" default>Power</option>
              <option value="heartRate" disabled>Heart Rate</option>
              <option value="cadence" disabled>Cadence</option>
              <option value="elevation" disabled>Elevation</option>
              <option value="speed" disabled>Speed</option>
              <option value="speed" disabled>Distance</option>
            </select>
            <span class="select-arrow"></span>
          </div>
        </div>

        <div class="controls-content">
          <div class="controls-content-title">
            Highest Power Averages
          </div>
          <div class="controls-content-list">
            <div class="content-list-titles">
              <div class="content-list-title">Time Interval (min)</div>
              <div class="content-list-title">Average Power Output (W)</div>
              <div class="content-list-title">Display</div>
            </div>
            <div class="content-list-row">
              <div class="content-list-datum">1</div>
              <div class="content-list-datum">{{one.average}}</div>
              <div class="content-list-datum">
                <input
                  type="radio"
                  name="displayedRange"
                  value="one"
                  :checked="selectedPowerRange === 'one'"
                  @change="onPowerRangeSelection"
                />
              </div>
            </div>
            <div class="content-list-row">
              <div class="content-list-datum">5</div>
              <div class="content-list-datum">{{five.average}}</div>
              <div class="content-list-datum">
                <input
                  type="radio"
                  name="displayedRange"
                  value="five"
                  :checked="selectedPowerRange === 'five'"
                  @change="onPowerRangeSelection"
                />
              </div>
            </div>
            <div class="content-list-row">
              <div class="content-list-datum">10</div>
              <div class="content-list-datum">{{ten.average}}</div>
              <div class="content-list-datum">
                <input
                  type="radio"
                  name="displayedRange"
                  value="ten"
                  :checked="selectedPowerRange === 'ten'"
                  @change="onPowerRangeSelection"
                />
              </div>
            </div>
            <div class="content-list-row">
              <div class="content-list-datum">15</div>
              <div class="content-list-datum">{{fifteen.average}}</div>
              <div class="content-list-datum">
                <input
                  type="radio"
                  name="displayedRange"
                  value="fifteen"
                  :checked="selectedPowerRange === 'fifteen'"
                  @change="onPowerRangeSelection"
                />
              </div>
            </div>
            <div class="content-list-row">
              <div class="content-list-datum">20</div>
              <div class="content-list-datum">{{twenty.average}}</div>
              <div class="content-list-datum">
                <input
                  type="radio"
                  name="displayedRange"
                  value="twenty"
                  :checked="selectedPowerRange === 'twenty'"
                  @change="onPowerRangeSelection"
                />
              </div>
            </div>
          </div>
        </div>
          
      </div>
    </div>

    <workout-chart
      name="Power Output"
      yLabel="Power (W)"
      :chartData="chartData"
    ></workout-chart>
  </div>
</template>



<script>
import WorkoutMap from './components/workout-map.vue';
import WorkoutChart from './components/workout-chart.vue';
import PeaksHeader from './components/peaks-header.vue';

import WO_DATA from './data/workout-data.json';
import {
  getWorkoutLatLng,
  getWorkoutTimePower,
  getMaxPowerAverage,
} from './utils/utils.js';

const accessToken = 'pk.eyJ1IjoiamRhbHRvbjMwOCIsImEiOiJjamZrbDl4c3UwNzNhMnhvNHN1NnE3NWRlIn0.R1lA0RhpM4caRNQlKBMsHQ';

// TODO:
// - Affordance to reset selected power interval
// - Style chart - fonts
// - Move "control panel" to component & vuex


export default {
  name: 'app',
  components: {
    WorkoutMap,
    WorkoutChart,
    PeaksHeader,
  },

  data() {
    return {
      // Map
      workoutPath: [],

      // Chart
      chartData: [],

      // Max Data
      one: {},
      five: {},
      ten: {},
      fifteen: {},
      twenty: {},

      selectedPowerRange: null,
    }
  },

  methods: {
    onPowerRangeSelection(e) {
      const {value} = e.target;

      const plotBand = {
        from: new Date(this[value].itemsTimePower[0][0]),
        to: new Date(this[value].itemsTimePower[this[value].itemsTimePower.length-1][0]),
        color: '#ffc5ba' // light orange
      };

      this.$store.commit('setSelectionLatLng', this[value].itemsLatLng);
      this.$store.commit('setPlotBand', plotBand);
      this.selectedPowerRange = value;
    },
  },

  beforeMount: function() {
    const {samples} = WO_DATA;

    // Store "best" efforts
    this.one = getMaxPowerAverage(1, samples);
    this.five = getMaxPowerAverage(5, samples);
    this.ten = getMaxPowerAverage(10, samples);
    this.fifteen = getMaxPowerAverage(15, samples);
    this.twenty = getMaxPowerAverage(20, samples);

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
  .controls {
    display: inline-block;
    flex: 1;

    .controls-title {
      padding: 20px 16px;

      h2 {
        margin: 0;
        display: inline-block;
      }
      .custom-select {
        position: relative;
        top: 5px;
        display: inline-block;
        float: right;

        select {
          font-size: 1rem;
          border-radius: 0;
          border: 0;
          background-color: $white;
          font-family: 'Montserrat', sans-serif;

          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        .select-arrow {
          display: inline-block;
          position: absolute;
          top: 8px;
          right: 14px;
          border-top: 5px solid #222;    
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
      }
    }
    .controls-content {
      .controls-content-title {
        margin-bottom: 12px;
        padding: 0 32px 0 16px;
      }
      .controls-content-list {
        text-align: center;

        .content-list-titles {
          display: flex;
          padding: 0 0 3px;

          .content-list-title {
            display: inline-block;
            flex: 1 0 0;
            font-size: 0.75rem;
            color: $grey-dark;
          }
        }
        .content-list-row {
          display: flex;
          padding: 6px 0;

          &:nth-child(2n+2) {
            background-color: $grey-light;
          }

          .content-list-datum {
            display: inline-block;
            flex: 1 0 0;
          }
        }
      }
    } // end .controls-content
  }
}


</style>
