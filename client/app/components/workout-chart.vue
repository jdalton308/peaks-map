
<template>
    <highcharts :options="chartOptions" ref="workoutChart"></highcharts>
</template>



<script>

import WO_DATA from '../data/workout-data.json';
import { getWorkoutLatLng } from '../utils/utils';
import { mapState } from 'vuex';


export default {
  name: 'workout-chart',
  props: [
    'name',
    'yLabel',
    'chartData',
  ],

  data() {
    return {
      chartOptions: {
        chart: {
          events: {
            selection: this.onChartSelection,
          },
          zoomType: 'x',
          className: 'workout-chart',
          height: (window.innerHeight/2 - 53),
        },
        title: {
          text: '',
          floating: true,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          type: 'datetime',
          // plotBands: [(this.plotBand && this.plotBand.start) ? this.plotBand : null],
        },
        yAxis: {
          title: {
            text: this.yLabel,
          }
        },
        series: [{
          type: 'line',
          data: this.chartData,
          name: this.name,
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
    ...mapState([
      'plotBand',
    ]),
  },

  watch: {
    plotBand: function(newVal) {
      // const newChartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      // newChartOptions.xAxis.plotBands = [newVal];
      // this.chartOptions = newChartOptions;

      const {chart} = this.$refs.workoutChart;
      console.log('chart ref: ', chart);
      chart.xAxis[0].addPlotBand(newVal);
      // chart.xAxis[0].addPlotBand({
      //   from: 2849000,
      //   to: 4243000,
      //   color: 'red',
      // });
    }
  },

  methods: {
    onChartSelection(e) {
      if (e.xAxis) {
        // Draw new highlighted path
        //-----
        const selectionMin = e.xAxis[0].min;
        const selectionMax = e.xAxis[0].max;

        // Draw polyline of selected data, on top of full path
        const startIndex = Math.round(selectionMin/1000);
        const endIndex = Math.round(selectionMax/1000);
        const selectionData = WO_DATA.samples.slice(startIndex, endIndex);

        this.$store.commit('setSelectionLatLng', getWorkoutLatLng(selectionData));

      } else {
        // Selection was reset, so clear highlighted path
        //-----
        this.$store.commit('setSelectionLatLng', []);
      }
    },

    onChartHover(e) {
      // Highlight point on map
      const hoverPoint = parseInt(e.target.category);
      const dataPoint = WO_DATA.samples.find((sample) => (sample.millisecondOffset === hoverPoint));

      if (dataPoint.values.positionLat) {
        this.$store.commit('setHoverLatLng', [dataPoint.values.positionLat, dataPoint.values.positionLong])
      }
    },

    onChartLeave(e) {
      this.$store.commit('setHoverLatLng', [])
    },
  },
}

</script>



<style lang="scss">

@import '../assets/style/_variables.scss';

.workout-chart {
  width: 100%;
  height: calc(50vh - 53px);
  min-height: 300px;
  box-shadow: 0 0 4px $grey-dark;
}

</style>
