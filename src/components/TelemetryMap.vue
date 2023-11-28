<template>
  <div class="map-container">
    <gmap-map
      ref="gmap"
      :center="map.config.center"
      :zoom="map.config.zoom"
      map-type-id="terrain"
      :style="`width: 100%; height: ${height}px`"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      }"
    >
      <gmap-cluster :zoom-on-click="true">
        <gmap-marker
          v-for="(item, index) in markers"
          :key="index"
          :position="item.position"
          :clickable="clickableIcon"
          :draggable="false"
          :icon="item.open ? iconActive : icon"
          @click="clickableIcon ? markerClick(item) : null"
        >
          <gmap-info-window
            v-if="clickableIcon && showPopups"
            :key="index"
            :options="{ maxWidth: 300 }"
            :opened="item.open"
            @closeclick="item.open = false"
          >
            <div class="vehicle-location-card">
              <div class="vehicle-card-content">
                <h6>{{item.vin}}</h6>
                <p>Location last updated: {{item.time}}</p>
              </div>
            </div>
          </gmap-info-window>
        </gmap-marker>
      </gmap-cluster>
    </gmap-map>
     <div v-show="showMessages && !markers.length && loading">
        <p>Vehicle Locations Loading</p>
      </div>
    <div v-show="showMessages && !markers.length && !loading">
      <p>No Vehicle Locations Available</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from '@/store/getter-types'
import dateUtility from '@/lib/dateUtility'

/* example usage:
  <telemetry-map
    clickable-icon
    :map="mapData"
    :vehicles-telemetry-points="vehicleTelemetryPointData"
    :loading="loading"
    :icon="iconObject"
  />
  clickable-icon: enables the gmap-info-window upon clicking an icon. Leave it off of the component tag if you
    don't want that functionality
  map: The map location and zoom info. Defaults to the arcimoto AMP facility
      map: {
        config: {
          center: {
            lat: latitude-value,
            lng: longitude-value
          },
          zoom: zoomLevel
        }
      }
  vehiclesTelemetryPoints: Object of telemetry points, indexed off of a vehicles vin. The inner data can either
    be two objects, or an array of objects
      I.e. Two objects:
    vehiclesTelemetryPoints: {
      DEV-7F7ATR312KER00000: {
        gpsLatitude: {
          point: pointData,
          time: timeData
        },
        gpsLongitude: {
          point: pointData,
            time: timeData
        }
      }
    }
      i.e. Array of objects
    vehiclesTelemetryPoints: {
      DEV-7F7ATR312KER00000: {
        [{
          gpsLatitude: {
            point: pointData,
            time: timeData
          },
          gpsLongitude: {
            point: pointData,
            time: timeData
          }
        },
        {},
        {}]
      }
    }
  loading: The loading state. This is used in Palantir components to handle showing or hiding
  icon: Option icon object. Defaults to a blue-fuv.
    icon: {
      url: 'url of image',
      size: {
        height: height of icon,
        width: width of icon
      }
    }
*/

export default {
  name: 'TelemetryMap',
  props: {
    activeItem: {
      default: null,
      type: String
    },
    clickableIcon: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 400
    },
    map: {
      type: Object,
      default: () => ({
        config: {
          center: {
          // arcimoto AMP facility in Eugene, OR, USA, EARTH :D
            lat: 44.057083,
            lng: -123.124967
          },
          zoom: 13
        }
      })
    },
    showMessages: {
      default: true,
      type: Boolean
    },
    showPopups: {
      default: true,
      type: Boolean
    },
    vehiclesTelemetryPoints: {
      type: Object,
      default: () => ({})
    },
    vins: {
      type: Array,
      default: () => ([])
    },
    icon: {
      type: Object,
      default: () => ({
        url: 'https://cdn.arcimoto.com/icons/fuv_circle_inactive.svg',
        size: {
          height: 50,
          width: 50
        }
      })
    },
    iconActive: {
      type: Object,
      default: () => ({
        url: 'https://cdn.arcimoto.com/icons/fuv_circle_active.svg',
        size: {
          height: 50,
          width: 50
        }
      })
    }
  },
  data: () => ({
    markers: [],
    openItem: null
  }),
  computed: {
    ...mapGetters({
      loading: LOADING
    })
  },
  watch: {
    activeItem: {
      handler (newVal) {
        if (!newVal) {
          this.markers.forEach(marker => { marker.open = false })
        }
      },
      immediate: true
    },
    vehiclesTelemetryPoints: {
      handler () {
        this.renderMap()
      },
      deep: true
    }
  },
  mounted () {
    this.renderMap()
  },
  methods: {
    gmapUpdate () {
      if (typeof this.$refs.gmap !== 'undefined') {
        // set bounds of the map
        this.$refs.gmap.$mapPromise.then((map) => {
          const bounds = new window.google.maps.LatLngBounds()
          if (this.markers.length) {
            for (const m of this.markers) {
              bounds.extend(m.position)
            }
          } else {
            bounds.extend(this.map.config.center)
          }
          // Don't zoom in too far on only one marker
          if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
            var extendPoint1 = new window.google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01)
            var extendPoint2 = new window.google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01)
            bounds.extend(extendPoint1)
            bounds.extend(extendPoint2)
          }
          map.fitBounds(bounds)
        })
      }
    },
    markerClick (item) {
      this.markers.forEach(marker => {
        marker.open = false
      })
      item.open = true
      this.$emit('marker-active', item.vin)
    },
    markersReset () {
      this.markers = []
    },
    markersDataSet () {
      this.markersReset()
      if (this.vehiclesTelemetryPoints) {
        this.vins.forEach(vin => {
          if (this.vehiclesTelemetryPoints[vin]) {
            const vehicleTelemetryPoints = this.vehiclesTelemetryPoints[vin]
            // if all data for gps available for vehicle create marker to display on map
            if (!Array.isArray(vehicleTelemetryPoints)) {
              this.createMarker(vin, vehicleTelemetryPoints, true)
            } else {
              vehicleTelemetryPoints.forEach((gpsPosition) => {
                this.createMarker(vin, gpsPosition)
              })
            }
          }
        })
      }
    },
    getCoordinates (item) {
      return {
        lat: item.gpsLatitude.point,
        lng: item.gpsLongitude.point
      }
    },
    gpsPointDataAvailable (vehicleTelemetryPoint) {
      return typeof vehicleTelemetryPoint !== 'undefined' &&
               typeof vehicleTelemetryPoint.gpsLatitude !== 'undefined' &&
               typeof vehicleTelemetryPoint.gpsLongitude !== 'undefined'
    },
    createMarker (vin, vehicleTelemetryPoints, singlePoint) {
      const marker = {
        vin,
        position: {
          lat: null,
          lng: null
        },
        time: null,
        open: vin === this.activeItem
      }

      if (this.gpsPointDataAvailable(vehicleTelemetryPoints)) {
        marker.position = this.getCoordinates(vehicleTelemetryPoints)
        marker.time = dateUtility.formatTsFromNowTelemetry(vehicleTelemetryPoints.gpsLatitude.time)
      }
      if (marker.position.lat && marker.position.lng) {
        if (this.markers.length && singlePoint) {
          // remove any existing markers for same vin
          this.markers = this.markers.filter(el => el.vin !== vin)
        }
        this.markers.push(marker)
      }
    },
    renderMap () {
      this.markersDataSet()
      this.gmapUpdate()
    }
  }
}
</script>
<style lang="scss">
  #app {
    .theme--dark {
      .vehicle-card-content{
        color: #1E1E1E;
        font-weight: bold;
        p {
          color: #1E1E1E;
          font-weight: bold;
        }
      }
    }
    .theme--light {
      .vehicle-card-content{
        font-weight: bold;
        p {
          font-weight: bold;
        }
      }
    }
  }
  </style>
