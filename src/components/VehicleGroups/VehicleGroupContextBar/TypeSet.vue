<template>
  <div class="fleet-type-set-container">
    <h3>Set Fleet Insurance Reporting Type</h3>
    <vue-form :state="formstate" @submit.prevent="fleetTypeSet">
      <div id="type-set-container">
        <div class="type-enable">
          <label for="enable-type">
            Enable Insurance Reporting Type for Fleet
          </label>
          <v-switch
            id="typeEnable"
            v-model="model.typeEnable"
            name="type-enable"
            type="checkbox"
            @change="typeSetEnabledToggled"
          />
        </div>
      </div>

      <div v-if="model.typeEnable" class="type form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="type">
              <label for="type">Insurance Reporting Type</label>
                <v-select
                  v-model="model.fleetType"
                  name="type"
                  required
                  :disabled="!model.typeEnable"
                  :items="fleetsTypes"
                  item-text="groupType"
                  item-value="groupType"
                  return-object
                  outlined
                ></v-select>
            </validate>
          </div>
        </div>
      </div>

      <v-btn
        class="group-type-set"
        color="success"
        type="submit"
        :disabled="submitDisabled"
        >Set Type</v-btn>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_TYPE_SAVE,
  FLEETS_TYPES_SUMMON
} from '@/store/action-types'
import {
  FLEET_TYPE,
  FLEETS_TYPES
} from '@/store/getter-types'

export default {
  name: 'FleetTypeSet',
  props: {
    fleetId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        toggled: false,
        typeEnable: false,
        fleetType: {
          groupType: null,
          id: null
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      fleetTypeGet: FLEET_TYPE,
      fleetsTypes: FLEETS_TYPES
    }),
    fleetType () {
      return this.fleetId ? this.fleetTypeGet(this.fleetId) : null
    },
    formFieldsUnchanged () {
      const { fleetType, model } = this
      if (model.fleetType) {
        return model.fleetType.groupType === fleetType
      } else {
        return model.fleetType === fleetType
      }
    },
    submitDisabled () {
      const { formFieldsUnchanged, formstate, model } = this
      return ((formstate.$invalid || !model.toggled) &&
             (formstate.$invalid || formstate.$pristine)) ||
             formFieldsUnchanged
    }
  },
  watch: {
    fleetType: {
      handler (newVal, oldVal) {
        if (newVal) {
          const fleetTypeValue = this.fleetType
          if (fleetTypeValue) {
            this.model.typeEnable = true
            this.model.fleetType.groupType = fleetTypeValue
          } else {
            this.model.typeEnable = false
            this.model.fleetType = null
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetTypeSaveAction: FLEET_TYPE_SAVE,
      fleetsTypesSummonAction: FLEETS_TYPES_SUMMON
    }),
    init () {
      this.fleetsTypesSummon()
    },
    typeSetEnabledToggled: function (toggleEvent) {
      this.model.toggled = true
      if (!toggleEvent) {
        this.model.fleetType = null
      }
    },
    async fleetTypeSet () {
      const componentSelf = this
      let groupType = null
      let typeId = null
      if (this.model.fleetType) {
        groupType = this.model.fleetType.groupType
        typeId = this.model.fleetType.id
      }
      const payload = {
        fleetId: this.fleetId,
        groupType: groupType,
        typeId: typeId
      }
      await this.fleetTypeSaveAction({ componentSelf, payload })
      this.$emit('fleet-type-set-complete')
    },
    async fleetsTypesSummon () {
      const componentSelf = this
      await this.fleetsTypesSummonAction({ componentSelf })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .type-enable {
    .v-input--switch {
      margin-top: 0;
    }
  }
}
</style>
