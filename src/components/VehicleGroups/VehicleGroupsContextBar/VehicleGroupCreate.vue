<template>
  <div class="vehicle-group-create-container">
    <h3>Create Vehicle Group</h3>
    <vue-form :state="formstate" @submit.prevent>
      <validate tag="div" class="groupName form-field">
        <label for="groupName" class="required">Group Name</label>
        <v-text-field
          id="groupName"
          v-model="model.groupName"
          name="groupName"
          type="text"
          required
          outlined
          :error-messages="groupNameErrorMessages"
        >
        <v-icon
            v-if="groupNameErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>
      <entity-navigation-control
        entity-name="fleet"
        @go-to-entity="navUpdate"
      />
    </vue-form>

    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="fleetCreateCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="submitDisabled"
        @click="fleetCreateSave"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { FLEET_CREATE } from '@/store/action-types'
import {
  FLEETS
} from '@/store/getter-types'

import EntityNavigationControl from '@/components/EntityNavigationControl.vue'

export default {
  name: 'FleetCreate',
  components: {
    EntityNavigationControl
  },
  data () {
    return {
      formstate: {},
      model: {
        groupName: null
      },
      goToFleet: true,
      submitDisable: false
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS
    }),
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    groupNameErrorMessages () {
      if (this.groupNameFound) {
        return 'Group Name must be Unique'
      }
      if (!this.groupNameLenTest) {
        return 'Group Name must be  between 5 and 128 characters'
      }
      if (!this.groupNameSpaces) {
        return 'Group Name can\'t begin or end with a space'
      }

      return null
    },
    groupNameFound () {
      return this.fleets.some(el => el.name === this.model.groupName)
    },
    groupNameLenTest () {
      var len = 0
      if (this.model.groupName) {
        len = this.model.groupName.length
      }
      return len < 129 && len > 4
    },
    groupNameSpaces () {
      return (/^\S.*[^.\s]$/.test(this.model.groupName))
    },
    submitDisabled () {
      return this.formstate.$pristine ||
      this.formstate.$invalid ||
      this.groupNameErrorMessages !== null ||
      this.submitDisable
    }
  },
  methods: {
    ...mapActions({
      fleetCreateAction: FLEET_CREATE
    }),
    fleetCreateCancel () {
      this.$emit('fleet-create-cancel')
    },
    async fleetCreateSave () {
      this.submitDisable = true
      const componentSelf = this
      const payload = {
        body: {
          group: this.model.groupName
        }
      }
      const id = await this.fleetCreateAction({ componentSelf, payload })
      const event = {
        id: id,
        navigate: this.goToFleet
      }
      this.$emit('fleet-create-complete', event)
      this.submitDisable = false
    },
    navUpdate (event) {
      this.goToFleet = event.value
    }
  }
}
</script>

<style scoped lang="scss">
#app {

  .vehicle-group-create-container {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
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
