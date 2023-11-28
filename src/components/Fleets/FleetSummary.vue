<template>
  <v-card
    class="fleet-summary rounded-xl"
    color="fleet-card"
    width="300px"
    height="175px"
    @click="handleClick(id)"
  >
    <v-card-title
      ><v-spacer />
      <div v-if="showFleetId" class="fleet-id" :class="{'fleet-id--text': darkModeEnabled, 'gray-blue--text': !darkModeEnabled}">
        Fleet Id: {{ id }}
      </div></v-card-title
    >
    <v-card-text>
      <div class="fleet-description gray-blue--text">{{ description }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'FleetSummary',
  props: {
    description: {
      default: '',
      type: String
    },
    id: {
      default: null,
      type: Number
    },
    showFleetId: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    handleClick (id) {
      this.$emit('click')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .fleet-summary {
    padding: 10px 12px 14px;
    margin-bottom: 20px;
    .fleet-id {
      font-size: 0.8rem;
    }
    .fleet-description {
      font-size: 1.5rem;
      line-height: 1.5rem;
    }
  }
  &.theme--dark {
    .fleet-summary {
      .fleet-id {
        background-color: transparent !important;
      }
    }
  }
}

</style>
