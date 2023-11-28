<template>
  <div class="ability-delete-container">
    <h3>Delete Ability</h3>
    <div>
        <label for="abilities" class="required">Abilities</label>
        <v-select
          v-model="model.abilityId"
          dense
          name="abilities"
          :items="abilities"
          item-text="ability"
          item-value="id"
          required
          outlined
        ></v-select>

      <v-btn
        :disabled="!model.abilityId"
        color=success
        type="button"
        @click="abilityDelete"
      >Delete</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USERS_ABILITY_DELETE } from '@/store/action-types'
import { ABILITIES } from '@/store/getter-types'

export default {
  name: 'AbilityDelete',
  data () {
    return {
      model: {
        abilityId: null
      }
    }
  },
  computed: {
    ...mapGetters({
      abilities: ABILITIES
    })
  },
  methods: {
    ...mapActions({
      abilityDeleteAction: USERS_ABILITY_DELETE
    }),
    abilityDelete () {
      const componentSelf = this
      const { abilityDeleteAction, model } = this
      const abilityId = model.abilityId
      const payload = {
        abilityId
      }
      abilityDeleteAction({ componentSelf, payload })
        .then(() => {
          this.$emit('ability-delete-complete')
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
