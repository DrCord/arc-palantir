<template>
  <div class="vehicle-token-sign-container">
    <h3>Sign Vehicle Token for Authority</h3>
    <div v-if="availableAuthorities.length">
      <div v-if="signTokenQrCode === null">
        <v-select
          v-model="authorityId"
          :items="availableAuthorities"
          item-text="description"
          item-value="id"
        ></v-select>
        <v-btn
          :disabled="!authorityId"
          color=success
          @click="vehicleSignToken"
        >Submit</v-btn>
        <div v-if="badResponse" class="bad-response">
          <p>Signing of your token request failed, please try again.</p>
        </div>
      </div>
        <div v-else>
          <div v-if="signTokenQrCode" class="qr-code">
            <p>Scan this QR Code to setup the software token association</p>
            <img :src="signTokenQrCode" />
          </div>
          <v-btn
            v-if="signTokenQrCode"
            color="red"
            @click="$emit('vehicle-sign-token-complete')"
          >Done</v-btn>
        </div>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  AUTHORITIES_SUMMON,
  VEHICLE_SIGN_TOKEN
} from '@/store/action-types'
import {
  AUTHORITIES,
  LOADING,
  VEHICLE_AUTHORITIES
} from '@/store/getter-types'

import QRCode from 'qrcode'

export default {
  name: 'VehicleTokenSign',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      authorityId: null,
      badResponse: false,
      signTokenQrCode: null,
      vehicleToken: null
    }
  },
  computed: {
    ...mapGetters({
      authorities: AUTHORITIES,
      loading: LOADING,
      vehicleAuthoritiesGet: VEHICLE_AUTHORITIES
    }),
    availableAuthorities () {
      const vehicleAuthorities = this.vehicleAuthorities.filter(authority => {
        return authority.id !== 1
      })
      vehicleAuthorities.sort((a, b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0))
      return vehicleAuthorities
    },
    vehicleAuthorities () {
      return this.vin ? this.vehicleAuthoritiesGet(this.vin) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      authoritiesSummonAction: AUTHORITIES_SUMMON,
      vehicleSignTokenAction: VEHICLE_SIGN_TOKEN
    }),
    init () {
      this.authoritiesSummon()
    },
    async authoritiesSummon () {
      const componentSelf = this
      await this.authoritiesSummonAction({ componentSelf })
    },
    generateQRCode () {
      QRCode.toDataURL(this.vehicleToken)
        .then(url => {
          this.signTokenQrCode = url
        })
    },
    async vehicleSignToken () {
      const componentSelf = this
      const payload = {
        vin: this.vin,
        body: {
          authority_id: this.authorityId,
          token: {
            vin: this.vin
          }
        }
      }
      this.vehicleToken = await this.vehicleSignTokenAction({ componentSelf, payload })
      this.vehicleToken ? this.generateQRCode() : this.badResponse = true
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-token-sign-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
    .bad-response {
      margin-top: 40px;
      color: red;
    }
    .qr-code {
      margin-bottom: 20px;
      margin-top: 40px;
    }
  }
}
</style>
