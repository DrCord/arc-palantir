import utility from '@/lib/utility'
import { LOADING_END } from '@/store/mutation-types'

const errors = {
  handleAxiosRequestError (self, error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx
      if (error.response.data.errorMessage) {
        this.handleError(self, error.response.data.errorMessage.replace(' {}', ''))
      } else {
        this.handleError(self, error)
      }
    } else if (error.request) {
      // The request was made but no response was received
      this.handleError(self, 'The request was made but no response was received')
    } else {
      // Something happened in setting up the request and triggered an Error
      this.handleError(self, error)
    }
  },
  handleError (self, e) {
    const config = {
      duration: null,
      icon: {
        name: 'error'
      },
      className: 'toasted-error'
    }
    utility.messageSet(self, e, config.icon.name, config.duration, config.className)
    const storeAvailable = errors.objPropExists(self, '$store')
    if (storeAvailable) {
      self.$store.commit(LOADING_END)
    }
  },
  objPropExists: (el, propName) => Object.prototype.hasOwnProperty.call(el, propName)
}

export default errors
