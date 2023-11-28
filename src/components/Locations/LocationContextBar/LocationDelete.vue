<template>
  <div class="location-delete-container">
    <h3>Delete Location</h3>
    <div>
      <h4>Are you sure you want to delete this location?</h4>
      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="locationDeleteCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="submit"
          color="success"
          type="button"
          :disabled="!locationId"
          @click="locationDeleteSubmit"
        >Delete<v-icon>mdi-delete-circle</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { LOCATION_DELETE } from '@/store/action-types'

import utility from '@/lib/utility'

export default {
  name: 'LocationDelete',
  props: {
    locationId: {
      type: Number,
      default: null
    }
  },
  methods: {
    ...mapActions({
      locationDeleteAction: LOCATION_DELETE
    }),
    locationDeleteCancel () {
      this.$emit('location-delete-cancel')
    },
    async locationDeleteSubmit () {
      const componentSelf = this
      const locationId = this.locationId
      const payload = {
        locationId,
        body: {}
      }
      await this.locationDeleteAction({ componentSelf, payload })
      utility.redirect(this, 'locations')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .location-delete-container {
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
