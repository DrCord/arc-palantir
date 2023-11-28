<template>
  <v-navigation-drawer
    v-model="active"
    app
    class="context-menu"
    :hide-overlay="!contextBarOutsideClickClose"
    right
    :stateless="!contextBarOutsideClickClose"
    temporary
    width="400px"
    @input="outsideClickCloseEmit"
  >
    <v-list-item>
      <v-icon large @click="$emit('context-bar-visible', false)">mdi-close</v-icon>
    </v-list-item>

    <v-list-item v-if="visible && !contentType">
      <actions
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'model-release-details'">
      <model-release-details
      :model-release-id="modelReleaseId"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'model-release-create'">
      <model-release-create
        @create-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'model-release-part-set'">
      <model-release-part-set
      :model-release-id="modelReleaseId"
      @part-set-complete="closeContext"
      />
    </v-list-item>
    <v-list nav> </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
} from '@/store/getter-types'

import Actions from '@/components/Vehicles/ModelReleases/ContextBar/Actions.vue'
import ModelReleaseCreate from '@/components/Vehicles/ModelReleases/ContextBar/Create.vue'
import ModelReleaseDetails from '@/components/Vehicles/ModelReleases/ContextBar/Details.vue'
import ModelReleasePartSet from '@/components/Vehicles/ModelReleases/ContextBar/PartSet.vue'

export default {
  name: 'ModelReleasesContextBar',
  components: {
    Actions,
    ModelReleaseCreate,
    ModelReleaseDetails,
    ModelReleasePartSet
  },
  props: {
    contentType: {
      type: String,
      default: null
    },
    modelReleaseId: {
      default: null,
      type: Number
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    active: false,
    modelRelease: null
  }),
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorPreferenceContextBarOutsideClickClose: OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
    }),
    contextBarOutsideClickClose () {
      const { operatorLoaded, operatorPreferenceContextBarOutsideClickClose } = this
      return operatorLoaded ? operatorPreferenceContextBarOutsideClickClose : null
    }
  },
  watch: {
    visible (newVal) {
      this.active = newVal
    }
  },
  methods: {
    changeContext (event) {
      this.$emit('change-context', event)
      if (event.params !== undefined) {
        if (event.contentType === 'model-release-details' && event.params.modelRelease !== undefined) {
          this.modelRelease = event.params.modelRelease
        }
      }
    },
    closeContext () {
      this.$emit('close-context')
    },
    closeContextBar () {
      this.$emit('context-bar-visible', false)
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    }
  }
}
</script>
