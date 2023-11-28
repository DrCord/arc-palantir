import * as vinValidator from 'vin-validator'

const utility = {
  dataTableDefaultFooterProps () {
    return {
      itemsPerPageOptions: [10, 20, 50, 100, -1]
    }
  },
  messageSet (self, msg, iconName, duration = 6000, className = 'toasted-message') {
    const config = {
      duration: duration,
      theme: 'toasted-primary',
      position: 'bottom-right',
      action: {
        text: 'Close',
        onClick: (e, toastObject) => {
          toastObject.goAway(0)
        }
      }
    }
    // uses material icons
    if (iconName) {
      config.icon = {
        name: iconName,
        color: 'red'
      }
    }
    if (className) {
      config.className = [className]
    }
    self.$toasted.show(msg, config)
  },
  prefixedInputCssProps (self) {
    return {
      '--prefixed-input-width': self.prefixedInputWidth
    }
  },
  recalls: {
    sortById (a, b) {
      return a.recall_id - b.recall_id
    },
    sortBySafetyFlag (a, b) {
      var aSafety = a.safety_recall
      var bSafety = b.safety_recall
      return (aSafety < bSafety) ? -1 : (aSafety > bSafety) ? 1 : 0
    }
  },
  redirect (componentSelf, routeName, params = {}) {
    componentSelf.$router.push({
      name: routeName,
      params
    })
  },
  resetFormState (self, exceptions = {}) {
    // exceptions is an object with format {key: fieldType}
    Object.keys(self.model).forEach(function (key, index) {
      if (typeof exceptions[key] !== 'undefined') {
        if (exceptions[key] === 'number') {
          self.model[key] = null
        }
      } else {
        self.model[key] = ''
      }
    })
    self.formstate._reset()
  },
  sortById (a, b) {
    return a.id - b.id
  },
  sortByVIN (a, b) {
    // sorts using year and then manufacturer sequence numeric
    // puts all invalid vins at end of list
    const vinGet = (item) => {
      let vin
      if (typeof item.vin !== 'undefined') {
        vin = item.vin
      } else {
        vin = item
      }
      return vin.replace('STAGE-', '').replace('DEV-', '')
    }
    const aVin = vinGet(a)
    const bVin = vinGet(b)

    const aVinValid = vinValidator.validate(aVin)
    const bVinValid = vinValidator.validate(bVin)
    if (!aVinValid || !bVinValid) {
      return aVin - bVin
    }
    const aYearCode = utility.vinGetYear(aVin)
    const bYearCode = utility.vinGetYear(bVin)

    if (aYearCode !== bYearCode) {
      return aYearCode - bYearCode
    } else {
      const aSerial = aVin.slice(-5)
      const bSerial = bVin.slice(-5)
      return aSerial - bSerial
    }
  },
  sortFirmware (a, b) {
    var textA = a[0].toUpperCase()
    var textB = b[0].toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  },
  sortNumericAscending (a, b) {
    return (a > b) ? 1 : -1
  },
  sortTable (col) {
    return (a, b) => {
      if (typeof a[col] === 'number') {
        return a[col] - b[col]
      } else {
        return a[col].localeCompare(b[col])
      }
    }
  },
  toggleLoading (self, state, setMsg = false, msg, icon) {
    const loading = state
    if (setMsg) {
      if (msg) {
        if (icon) {
          this.messageSet(self, msg, icon)
        } else {
          this.messageSet(self, msg)
        }
      } else {
        this.messageSet(self, loading ? 'Loading' : 'Loaded', loading ? 'hourglass_empty' : 'check')
      }
    }
  },
  vinGetYear (vin) {
    const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039]
    const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const pos7 = vin.charAt(6)
    const pos10 = vin.charAt(9)
    let i = 0
    if (isNaN(pos7)) {
      i = values.lastIndexOf(pos10)
    } else {
      i = values.indexOf(pos10)
    }
    return years[i]
  }
}

export default utility
