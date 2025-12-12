import { defineStore } from 'pinia'
import type { Contact, PaginatedResponse } from '@/types/contact_temp'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'
const CACHE_NAME = 'contact-app-v1'

const api = axios.create({
  baseURL: BASE_URL
})
export const useContactStore = defineStore('contact', {
  state: () => ({
    contacts: [] as Contact[],

    currentPage: 1,
    itemsPerPage: 9,
    totalPages: 1,
    totalItems: 0,

    isSyncing: false,
    lastUpdated: null as string | null,

    scannedResult: [] as any
  }),
  persist: {
    key: "hasil-scan-qrcode",
    pick: ['scannedResult']
  },
  actions: {
    getCacheKey(page: number) {
      return `${BASE_URL}/contacts?page=${page}&limit=${this.itemsPerPage}`
    },


    async fetchContacts(page: number = 1) {
      this.currentPage = page;
      const cacheKey = this.getCacheKey(page);

      try {
        const cache = await caches.open(CACHE_NAME)
        const cachedResponse = await cache.match(cacheKey)

        if (cachedResponse) {
          const result: PaginatedResponse = await cachedResponse.json()
          this.contacts = result.data
          this.totalPages = result.meta.totalPages
          this.totalItems = result.meta.totalItems
        } else {
          console.log(`Cache Page ${page} kosong, fetch dari network...`)
          await this.refreshDataFromNetwork(page)
        }
      } catch (error) {
        console.error('Error loading cache:', error)
        await this.refreshDataFromNetwork(page)
      }
    },
    async refreshDataFromNetwork(page: number) {
      try {
        const cacheKey = this.getCacheKey(page);

        const response = await api.get<PaginatedResponse>(`/contacts`, {
          params: { page, limit: this.itemsPerPage }
        })

        const freshData = response.data

        this.contacts = freshData.data
        this.totalPages = freshData.meta.totalPages
        this.totalItems = freshData.meta.totalItems
        this.lastUpdated = new Date().toLocaleTimeString()


        const cache = await caches.open(CACHE_NAME)
        const jsonResponse = new Response(JSON.stringify(freshData), {
          headers: { 'Content-Type': 'application/json' }
        })
        await cache.put(cacheKey, jsonResponse)
      } catch (error) {
        console.error('Gagal fetch network:', error)
      }
    },
    async syncAndRefresh() {
      if (this.isSyncing) return
      this.isSyncing = true

      try {
        console.log('Sync Background dimulai...')
        await api.post('/contacts/sync')
        console.log('Sync Selesai. Refresh halaman aktif...')

        await this.refreshDataFromNetwork(this.currentPage)

      } catch (error) {
        console.error('Gagal sync:', error)
      } finally {
        this.isSyncing = false
      }
    },
    async changePage(newPage: number) {
      if (newPage > 0 && newPage <= this.totalPages) {
        await this.fetchContacts(newPage);
      }
    },

    addScanResult(data: any) {
      const exist = this.scannedResult.find((item: any) => item.rawValue === data.rawValue)

      if (!exist) {
        this.scannedResult.push(data)
      }
    },

    clearScannedResults() {
      this.scannedResult = []
    },

    saveScannedDataToContacts() {
    }
  },
  getters: {
    totalContacts: (state) => state.contacts.length
  }
})
