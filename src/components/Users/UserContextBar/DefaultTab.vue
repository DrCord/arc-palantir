<template>
  <div class="default-tab-container">
        <v-select
          v-model="defaultTab"
          :items="tabOptions"
          name="defaultTabSelect"
          dense
          outlined
          :label="label"
          clearable
        ></v-select>
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
  name: 'DefaultTab',
  props: {
    tabOptions: {
      default: () => [],
      type: Array
    },
    label: {
      default: null,
      type: String
    },
    defaultProperty: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      defaultTab: null
    }
  },
  computed: {
    ...mapGetters({
      operatorPreference: OPERATOR_PREFERENCE,
      operatorUsername: OPERATOR_USERNAME
    }),
    userDefaultTab () {
      return this.operatorPreference(this.defaultProperty)
    }
  },
  watch: {
    defaultTab: {
      handler () {
        this.setPreference()
      }
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
      this.defaultTab = this.userDefaultTab
    },
    async setPreference () {
      if (this.operatorPreference(this.defaultProperty) === this.defaultTab) {
        return
      }
      const componentSelf = this
      const payload = {
        username: this.operatorUsername,
        body: {
          preference_identifier: this.defaultProperty,
          preference_value: this.defaultTab ? this.defaultTab : ''
        }
      }
      await this.userPreferenceSaveAction({ componentSelf, payload })
    }
  }
}
</script>

<style lang="scss">
.default-tab-container {
  margin-top: 0rem;
  margin-bottom: 0rem;
}
</style>
