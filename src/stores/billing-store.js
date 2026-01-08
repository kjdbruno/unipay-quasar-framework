import { defineStore, acceptHMRUpdate } from 'pinia'

export const useBillingStore = defineStore('billingStore', {
  state: () => ({
    component: null,
    filter: null,
    isEdit: false,
    dialog: false,
    isLoading: false,
    isLoadingTable: false,
    office: null,
  }),

  getters: {
    
  },

  
  actions: {
    
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBillingStore, import.meta.hot))
}
