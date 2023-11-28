<template>
  <div class="authority">
    <v-card>
      <v-card-title>
        <h3>Authority Id: {{ authorityId }}</h3>
      </v-card-title>
      <v-card-text v-if="authority">
        <h4>Description: {{ authority.description }}</h4>
        <h4 v-if="authorityGet(authority.parentId)">Parent: {{ authorityGet(authority.parentId).description }}</h4>
        <h5>Children:</h5>
        <v-data-table
          v-if="authority.children && authority.children.length"
          :headers="tableHeaders"
          :items="authority.children"
        >
          <template #[`item.id`]="{ item }">
            <router-link :to="authorityLinkObject(item.id)">{{
              item.id
            }}</router-link>
          </template>
          <template #[`item.description`]="{ item }">
            <router-link :to="authorityLinkObject(item.id)">{{
              item.description
            }}</router-link>
          </template>
        </v-data-table>
        <p v-else>None</p>
        <h5>Vehicles (VIN):</h5>
        <ul v-if="authorityVins.length" class="vins">
          <li v-for="vin in authorityVins" :key="vin">
            <router-link :to="vehicleLinkObject(vin)">{{ vin }}</router-link>
          </li>
        </ul>
        <p v-else>None</p>
      </v-card-text>
    </v-card>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :authority-id="authorityId"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
      @authority-grant-vehicle-access-complete="authorityVinsSet"
      @authority-revoke-vehicle-access-complete="authorityVinsSet"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  AUTHORITIES,
  AUTHORITY,
  AUTHORITY_VINS,
  ACCESS_AUTHORITIES_ADMIN,
  LOADING,
  OPERATOR_ABILITIES
} from '@/store/getter-types'

import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Authorities/AuthorityContextBar/ContextBar.vue'

export default {
  name: 'Authority',
  components: {
    ContextBarToggle,
    ContextBar
  },
  props: {
    authorityId: {
      type: [Number, String],
      default: null
    }
  },
  data: () => ({
    authorityVins: [],
    contextBarContentType: null,
    contextBarVisible: false,
    tableHeaders: [
      {
        text: 'Id',
        value: 'id',
        sortable: true
      },
      {
        text: 'Description',
        value: 'description',
        sortable: true
      }
    ]
  }),
  computed: {
    ...mapGetters({
      authorities: AUTHORITIES,
      authorityGet: AUTHORITY,
      authorityVinsGet: AUTHORITY_VINS,
      loading: LOADING,
      operatorAbilities: OPERATOR_ABILITIES,
      operatorCanDeleteAuthority: ACCESS_AUTHORITIES_ADMIN
    }),
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanDeleteAuthority
    },
    authority () {
      return this.authorityId ? this.authorityGet(this.authorityId) : {}
    }
  },
  watch: {
    authorityId: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.authorityVinsSet()
        }
      },
      immediate: true
    }
  },
  methods: {
    authorityVinsSet () {
      this.authorityVins = this.authorityVinsGet(this.authorityId)
    },
    authorityLinkObject (id) {
      return {
        name: 'authority',
        params: { id }
      }
    },
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    },
    vehicleLinkObject (vin) {
      return {
        name: 'vehicle',
        params: { vin }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.authority {
  h4 {
    color: rgba(0, 0, 0, 0.87);
  }
  h5 {
    color: rgba(0, 0, 0, 0.87);
  }
  .vins {
    list-style: none;
    display: grid;

    @media screen and (max-width: 600px) {
      grid-template-columns: 1fr;
    }
    @media screen and (min-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }
    @media screen and (min-width: 900px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media screen and (min-width: 1200px) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    grid-column-gap: 5px;
    li {
      margin-top: 3px;
    }
  }
  &.theme--dark {
    h4 {
      color: #fff
    }
    h5 {
      color: #fff
    }
  }
}
</style>
