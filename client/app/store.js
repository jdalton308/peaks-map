
const store = {
  state: {
    hoverLatLng: null,
    selectionLatLng: null,

    plotBand: {
      from: null,
      to: null,
      color: null,
    },
  },

  mutations: {
    setHoverLatLng: function(state, latLng) {
      state.hoverLatLng = latLng;
    },
    setSelectionLatLng: function(state, latLng) {
      state.selectionLatLng = latLng;
    },

    setPlotBand: function(state, plotObj) {
      state.plotBand = plotObj;
    },
    resetPlotBand: function(state) {
      state.plotBand = {
        start: null,
        end: null,
        color: null,
      };
    },
  }
}

export default store;