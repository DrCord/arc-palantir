<template>
  <div class="quick-actions-container">
    <h3>Abilities Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanCreateAbility">
        <v-btn @click="createAbility">
          Create
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanDeleteAbility">
        <v-btn @click="deleteAbility">
          Delete
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanEditAbility">
        <v-btn @click="editAbility">
          Edit
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_ABILITY_CREATE,
  ACCESS_ABILITY_DELETE,
  ACCESS_ABILITY_EDIT
} from '@/store/getter-types'
export default {
  name: 'AbilitiesActions',
  computed: {
    ...mapGetters({
      operatorCanCreateAbility: ACCESS_ABILITY_CREATE,
      operatorCanDeleteAbility: ACCESS_ABILITY_DELETE,
      operatorCanEditAbility: ACCESS_ABILITY_EDIT
    })
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    createAbility () {
      this.changePanel('ability-create')
    },
    deleteAbility () {
      this.changePanel('ability-delete')
    },
    editAbility () {
      this.changePanel('ability-edit')
    }
  }
}
</script>
