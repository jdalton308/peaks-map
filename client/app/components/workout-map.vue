
<template>

<div id="map"></div>

</template>



<script>

import L from 'leaflet';
import { mapState } from 'vuex';

const accessToken = 'pk.eyJ1IjoiamRhbHRvbjMwOCIsImEiOiJjamZrbDl4c3UwNzNhMnhvNHN1NnE3NWRlIn0.R1lA0RhpM4caRNQlKBMsHQ';



export default {
  name: 'workout-map',
  props: [
    'path',
  ],

  data() {
    return {
      map: null,
      mapMarker: null,
      workoutPath: null,
      mapHighlightPath: null,
    }
  },

  computed: {
    ...mapState([
      'selectionLatLng',
      'hoverLatLng',
    ]),
  },

  watch: {
    path: function(newVal) {
      if (this.map && newVal.length) {
        this.putWorkoutOnMap();
      }
    },
    hoverLatLng: function(newVal) {
      if (newVal.length) {
        this.drawMarker();
      } else if (this.mapMarker) {
        this.clearMarker();
      }
    },
    selectionLatLng: function(newVal) {
      if (newVal.length) {
        this.drawHighlightedPath();
      } else {
        this.clearHighlightedPath();
      }
    }
  },

  methods: {
    initializeMap() {
      this.map = L.map('map').setView([39.7839, 104.99], 13);

      L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: accessToken,
        detectRetina: true,
      }).addTo(this.map);
    },

    putWorkoutOnMap() {
      if (this.path) {
        this.workoutPath = L.polyline(this.path, {color:'#2B9EB3', smoothFactor:2}).addTo(this.map);
        this.map.fitBounds(this.workoutPath.getBounds());
      }
    },

    drawHighlightedPath() {
      if (this.mapHighlightPath) {
        this.mapHighlightPath.remove();
      }
      this.mapHighlightPath = L.polyline(this.selectionLatLng, {color:'#E64120', weight:4, smoothFactor:2}).addTo(this.map);
      this.map.fitBounds(this.mapHighlightPath.getBounds());
    },

    clearHighlightedPath() {
      if (this.mapHighlightPath) {
        this.mapHighlightPath.remove();
        this.map.fitBounds(this.workoutPath.getBounds());
      }
    },

    drawMarker() {
        if (!this.mapMarker) {
          this.mapMarker = L.marker(this.hoverLatLng, {autoPan:true}).addTo(this.map);
        } else {
          this.mapMarker.setLatLng(this.hoverLatLng);
        }
    },

    clearMarker() {
      this.mapMarker.remove();
      this.mapMarker = null;
    }
  },

  mounted: function() {
    this.initializeMap();
    if (this.path.length) {
      this.putWorkoutOnMap();
    }
  }
}

</script>



<style lang="scss">

#map {
  height: 100%;
  width: 100%;
}

</style>
