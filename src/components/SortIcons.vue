<template>
    <i
      class="fas fa-sort"
      :class="{
        'fa-sort' : sortInfo.dir === '',
        'fa-sort-up': sortInfo.type === column && sortInfo.dir === 'asc',
        'fa-sort-down': sortInfo.type === column && sortInfo.dir === 'desc'
      }"
    ></i>
</template>

<script>
export default {
  name: 'SortIcons',
  props: {
    sortInfo: {
      type: Object,
      default: () => ({})
    },
    column: {
      type: String,
      default: ''
    }
  }
}
</script>
