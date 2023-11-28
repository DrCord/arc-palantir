<template>
  <v-tooltip right>
    <template #activator="{ on }">
      <span v-if="item" class="profile-data-item" @click="copyToClipboard(item)" v-on="on" >
        {{item}}
      </span>
    </template>
    <span>Click to copy</span>
  </v-tooltip>
</template>

<script>

import CopyToClipboard from '@/mixins/CopyToClipboard.js'
export default {
  name: 'ProfileDataItem',
  mixins: [CopyToClipboard],
  props: {
    item: {
      default: null,
      type: String
    },
    icon: {
      default: null,
      type: String
    }
  }
}
</script>
<style scoped lang="scss">
#app {
  .profile-data-item {
    cursor: pointer;
  }
}
</style>
