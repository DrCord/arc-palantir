<template>
  <v-card
    v-if="recall"
    class="mx-auto recall-card recall-display-card"
    max-width="700px"
    max-height="800px"
  >
    <v-card-title class="text-h5">
      <v-row>
        <v-col cols="auto" md="10" sm="10">
          {{ recall.title }}
        </v-col>
        <v-col class="id" cols="auto" md="2" sm="2">
          {{ recall.recallId }}
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="date" cols="auto" md="7" sm="7">
          {{ formatDate(recall.date) }}
        </v-col>
        <v-col
          :class="[recallStatus]"
          cols="auto"
          md="5"
          sm="5"
        >
          <b>{{ recall.status}}</b>
        </v-col>
      </v-row>
      <p class="text-h6">Recall Info</p>
      <p class="recall-description">{{ recall.description }}<br></p>
      <p><b>Manufacturer Campaign ID: </b>{{ recall.mfrCampaignId }}<br></p>
      <p><b>NHTSA Number: </b>{{ recall.nhtsaNumber }}<br></p>
      <p
        :class="[safetyRecallStatus]"
      ><b>Safety Recall: </b>
      <v-icon v-if="safetyRecallStatus === 'enabled'">mdi-check-bold</v-icon>
      <v-icon v-else>mdi-close-thick</v-icon>
      <br>
    </p>
    <p v-if="recall.safetyRecall"><b>Safety Description: </b>{{ recall.safetyDescription }}<br></p>
    </v-card-text>
    <div v-if="recall.remedy">
      <v-divider></v-divider>
      <v-card-title class="text-h5">
      Remedy<v-spacer /><span class="id">{{ recall.remedy.id }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            class="date"
            cols="auto"
            md="7"
            sm="7"
          >
            {{ formatDate(recall.remedy.date) }}
          </v-col>
        </v-row>
        <p class="text-h6">Remedy Info</p>
        <p class="recall-description">{{ recall.remedy.description }}<br></p>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { RECALL } from '@/store/getter-types'
import dateUtility from '@/lib/dateUtility'

export default {
  name: 'RecallDisplayCard',
  props: {
    recallId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      recallGet: RECALL
    }),
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : null
    },
    recallStatus () {
      if (this.recall.status === 'active') {
        return 'active'
      } else {
        return 'inactive'
      }
    },
    safetyRecallStatus () {
      if (this.recall.safetyRecall) {
        return 'enabled'
      } else {
        return 'disabled'
      }
    }
  },
  methods: {
    formatDate (date) {
      return dateUtility.formatOutput(date)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .recall {
    display: flex;
    justify-content: center;
    .v-card__title {
      word-break: normal;
    }
    .v-divider {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .id {
      color: grey;
      text-align: right;
    }
    .date {
      color: grey;
    }
    .v-card__text {
      div {
        font-size: 1.1rem;
      }
      .active {
        text-align: right;
        color: green;
      }
      .inactive {
        text-align: right;
        color: red;
      }
      p {
        color: black;
        text-align: left;
        margin-bottom: 0px;
      }
      .recall-description {
        color: black;
        margin-bottom: 10px;
      }
      .enabled {
        i {
          color: green;
        }
      }
      .disabled {
        i {
          color: red;
        }
      }
    }
  }
  &.theme--dark {
    .v-card__text {
      p {
        color: #fff;
      }
      .recall-description {
        color: #fff
      }
    }
  }
}
</style>
