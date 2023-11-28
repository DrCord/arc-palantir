const filters = {
  allCaps (value) {
    if (!value) return ''
    value = value.toString()
    return value.toUpperCase()
  },
  capitalize (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  humanize (str) {
    if (!str) return ''
    var i
    var frags = str.split('_')
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
    }
    return frags.join(' ')
  },
  titleCase (str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      }
    )
  }
}

export default filters
