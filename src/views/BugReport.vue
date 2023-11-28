<template>
  <div class="bug-report">
    <page-header title="Bug Report" />
    <div class="content-container">
      <h3>Fill out the form to prepare a bug report email</h3>

      <vue-form :state="formstate" @submit.prevent>

        <div v-if="submitted">
          <v-alert
            color="success"
            dark
          >Your email has been drafted, You may navigate away from this form.
          </v-alert>
        </div>

        <validate tag="div" class="bug-title">
          <label for="title" class="required">Title</label>
          <v-text-field
            id="title"
            v-model="model.title"
            name="title"
            type="text"
            required
            minlength="6"
            maxlength="70"
            outlined
            :error-messages="titleErrorMessages"
          >
            <v-icon
              v-if="titleErrorMessages"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <div class="manager form-field">
          <div class="field">
            <div class="label">
              <label for="manager">Manager Name
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>Please put your direct supervisor, or the head of your department.</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="manager"
                v-model="model.manager"
                name="manager"
                type="text"
                outlined
                hide-details
              />
            </div>
          </div>
        </div>

        <div class="url form-field">
          <div class="field">
            <div class="label">
              <label for="url">URL</label>
              <v-text-field
                id="url"
                v-model="model.url"
                name="url"
                type="text"
                minlength="6"
                maxlength="70"
                outlined
                hide-details
              />
            </div>
          </div>
        </div>

        <validate tag="div" class="priority">
          <label for="priority" class="required">Priority
            <v-tooltip bottom>
              <template #activator="{ on }">
                  <v-icon v-on='on'>mdi-information</v-icon>
              </template>
              <span><b>High:</b> System is affected and unusable until resolved</span>
              <span><br><b>Medium:</b> Bug can be addressed at the normal course of development</span>
              <span><br><b>Low:</b> Bug can be fixed at a later date. Other, more serious bugs take priority</span>
            </v-tooltip>
          </label>
          <v-select
            v-model="model.priority"
            name="priority"
            :items="priorities"
            dense
            item-text="priority"
            item-value="priority"
            required
            clearable
            outlined
            :error-messages="priorityErrorMessages"
          >
            <v-icon
              v-if="priorityErrorMessages"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-select>
        </validate>

        <div class="error-msg form-field">
          <div class="field">
            <div class="label">
              <label for="errorMsg">Error Message
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>Error that comes up in the bottom right of your screen?</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="error-msg"
                v-model="model.errorMsg"
                name="errorMsg"
                type="text"
                outlined
                hide-details
              />
            </div>
          </div>
        </div>

        <validate tag="div" class="description">
          <label for="description" class="required">Description
            <v-tooltip bottom>
              <template #activator="{ on }">
                  <v-icon v-on='on'>mdi-information</v-icon>
              </template>
              <span>Describe the bug. If necessary give steps to repeat it.</span>
            </v-tooltip>
          </label>
          <v-textarea
            id="description"
            v-model="model.description"
            required
            name="description"
            rows="1"
            auto-grow
            outlined
            :error-messages="descriptionErrorMessages"
          >
            <v-icon
              v-if="descriptionErrorMessages"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-textarea>
        </validate>

        <div>
          <v-alert
            dark
            color="secondary"
          >To include a screenshot, press 'Submit' and add the screenshot as an attachment to the email.
          </v-alert>
        </div>

      <div class="btn-container">
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="formstate.$pristine || formstate.$invalid"
          @click="openEmailClient"
        >Submit<v-icon>mdi-email</v-icon>
        </v-btn>
      </div>
      </vue-form>
    </div>
  </div>
</template>

<script>

import Bowser from 'bowser'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'BugReport',
  components: {
    PageHeader
  },
  props: {
    open: { type: Boolean, default: false }
  },
  data () {
    return {
      formstate: {},
      submitted: false,
      model: {
        title: null,
        manager: null,
        url: null,
        errorMsg: null,
        description: null
      },
      priorities: [
        { priority: 'High' },
        { priority: 'Medium' },
        { priority: 'Low' }
      ]
    }
  },
  computed: {
    descriptionErrorMessages () {
      if (this.descriptionErrorStateRequired) {
        return 'Description is required'
      }
      return null
    },
    descriptionErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { description } = formstate
      if (!description || description.$untouched) {
        return null
      }
      if (description.$invalid && description.$error.required) {
        return true
      }
      return null
    },
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    priorityErrorMessages () {
      if (this.priorityErrorStateRequired) {
        return 'Priority is required'
      }
      return null
    },
    priorityErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { priority } = formstate
      if (!priority || priority.$untouched) {
        return null
      }
      if (priority.$invalid && priority.$error.required) {
        return true
      }
      return null
    },
    titleErrorMessages () {
      if (this.titleErrorStateMinLength) {
        return 'Minimum length is 6 characters'
      }
      if (this.titleErrorStateRequired) {
        return 'Title is required'
      }
      return null
    },
    titleErrorStateMinLength () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { title } = formstate
      if (!title || title.$untouched) {
        return null
      }
      if (title.$invalid && title.$error.minlength) {
        return true
      }
      return null
    },
    titleErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { title } = formstate
      if (!title || title.$untouched) {
        return null
      }
      if (title.$invalid && title.$error.required) {
        return true
      }
      return null
    }
  },
  methods: {
    buildEmailBody () {
      var body = ''
      const browser = Bowser.parse(window.navigator.userAgent)
      const newLine = '%0D%0A'
      body += 'Browser: ' + browser.browser.name + ' ' + browser.browser.version + newLine
      body += newLine + 'Operating System: ' + browser.os.name + ' ' + browser.os.versionName + newLine
      body += newLine + 'Platform: ' + browser.platform.type + newLine
      if (this.model.url) {
        body += newLine + 'Manager: ' + this.model.manager + newLine
      }
      if (this.model.url) {
        body += newLine + 'URL: ' + this.model.url + newLine
      }
      if (this.model.priority) {
        body += newLine + 'Priority: ' + this.model.priority + newLine
      }
      if (this.model.errorMsg) {
        body += newLine + 'Error Message: ' + this.model.errorMsg + newLine
      }
      if (this.model.description) {
        body += newLine + 'Description: ' + this.model.description + newLine
      }
      return body
    },
    close () {
      this.$emit('close')
    },
    openEmailClient () {
      const email = 'IT@arcimoto.com'
      const subject = 'Palantir - Bug Report: ' + this.model.title
      const body = this.buildEmailBody()
      window.open('mailto:' + email + '?subject=' + subject + '&body=' + body)
      this.submitted = true
    }
  }
}
</script>

<style lang="scss">
#app {
  .bug-report {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    .url {
      margin-top: 0px;
    }
    .manager {
      margin-top: 0px;
    }
    .error-msg {
      margin-top: 0px;
    }
    h3 {
      margin-bottom: 10px;
    }
    .v-input--checkbox {
      margin-bottom: 20px;
      margin-top: 0px;
      padding: 0;
      .v-icon {
        font-size: 2rem;
      }
    }
    .btn-container {
      margin-top: 0px;
      margin-bottom: 50px;
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
