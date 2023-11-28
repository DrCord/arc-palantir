<template>
  <div id="go-to-entity-container">
    <v-checkbox
      id="go-to-entity"
      v-model="goToEntity"
      :label="navLabel"
      @click="setPreference"
    ></v-checkbox>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USER_PREFERENCE_SAVE } from '@/store/action-types'
import {
  OPERATOR_PREFERENCE,
  OPERATOR_USERNAME
} from '@/store/getter-types'

export default {
  name: 'EntityNavigationControl',
  props: {
    entityName: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      goToEntity: null
    }
  },
  computed: {
    ...mapGetters({
      operatorPreference: OPERATOR_PREFERENCE,
      operatorUsername: OPERATOR_USERNAME
    }),
    goToEntityDefault () {
      const prefObj = this.operatorPreference(this.preferenceName)
      return prefObj &&
       'value' in prefObj &&
        prefObj.value === 'on'
    },
    navLabel () {
      return 'Navigate to New ' + this.entityName.replace(/^\w/, c => c.toUpperCase())
    },
    preferenceName () {
      return 'auto_navigate_to_new_' + this.entityName
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      userPreferenceSaveAction: USER_PREFERENCE_SAVE
    }),
    init () {
      this.goToEntity = this.goToEntityDefault
      this.$emit('go-to-entity', { value: this.goToEntity })
    },
    async setPreference () {
      const toggleValue = this.goToEntity ? 'on' : 'off'
      if (this.operatorPreference(this.preferenceName) === toggleValue) {
        return
      }
      this.$emit('go-to-entity', { value: this.goToEntity })
      const componentSelf = this
      const payload = {
        username: this.operatorUsername,
        body: {
          preference_identifier: this.preferenceName,
          preference_value: toggleValue
        }
      }
      await this.userPreferenceSaveAction({ componentSelf, payload })
    }
  }
}
</script>

<style lang="scss">
    #go-to-entity-container {
    padding-left: 1rem;
    }
    label[for=go-to-entity]{
      color: black !important;
      font-size: smaller;
      vertical-align: text-bottom;
      padding:0px;
      margin:0px;
    }
    .theme--dark {
          label[for=go-to-entity]{
          color: #fff !important;
        }
      }
</style>
