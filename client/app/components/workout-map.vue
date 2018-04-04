
<template>
  <div id="map"></div>
</template>



<script>
import L from 'leaflet';

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
  name: 'workout-map',
  props: [
    // TODO: Typechecking
    'path', // array of [lat,lng] subarrays
    'highlightedPath', // if present, draw
    'marker',  // if present, show
  ],
  components: {
  },
  data() {
    return {
      map: null,
      mapMarker: null,
      workoutPath: null,
      mapHighlightPath: null,
    }
  },
  computed: {
    // TODO: Move watcher logic into computed?
  },
  watch: {
    path: function(newVal) {
      if (this.map && newVal.length) {
        this.putWorkoutOnMap();
      }
    },
    marker: function(newVal, oldVal) {
      if (newVal) {
        this.drawMarker();
      } else if (this.mapMarker) {
        this.clearMarker();
      }
    },
    highlightedPath: function(newVal) {
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
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: accessToken,
        detectRetina: true,
      }).addTo(this.map);
    },

    putWorkoutOnMap() {
      if (this.path) {
        this.workoutPath = L.polyline(this.path, {color:'#44AF69', smoothFactor:2}).addTo(this.map);
        this.map.fitBounds(this.workoutPath.getBounds());
      }
    },

    drawHighlightedPath() {
      this.mapHighlightPath = L.polyline(this.highlightedPath, {color:'#F8333C', weight:4, smoothFactor:2}).addTo(this.map);
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
          this.mapMarker = L.marker(this.marker, {autoPan:true}).addTo(this.map);
        } else {
          this.mapMarker.setLatLng(this.marker);
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
  height: 50vh;
  width: 50vw;
}

</style>
