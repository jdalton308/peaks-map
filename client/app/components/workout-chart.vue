
<template>
    <highcharts :options="chartOptions"></highcharts>
</template>



<script>

export default {
  name: 'workout-chart',
  components: {
  },
  props: [
    'name',
    'yLabel',
    'chartData',
    'onChartSelection',
    'onDataHover',
    'onChartLeave',
  ],
  data() {
    return {
      chartOptions: {
        chart: {
          events: {
            selection: this.onChartSelection,
          },
          zoomType: 'x',
        },
        title: {
          text: this.name,
        },
        xAxis: {
          type: 'datetime',
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
              mouseOver: this.onDataHover,
            }
          }
        }]
      }
    }
  },
  methods: {
  },
}

</script>



<style lang="scss">



</style>
