<script setup lang="ts">
import { useContactStore } from '@/stores/contactStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const contactStore = useContactStore()
const {
  contacts,
  isSyncing,
  lastUpdated,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  scannedResult,
} = storeToRefs(contactStore)

const showScanner = ref(false)
const errorInfo = ref('')

const onDetect = (detectedQRCodes: any[]) => {
  detectedQRCodes.forEach((code) => {
    try {
      const parsedData = JSON.parse(code.rawValue)
      contactStore.addScanResult({
        ...parsedData,
        rawValue: code.rawValue,
        timestamp: new Date().toLocaleTimeString(),
      })
    } catch (e) {
      contactStore.addScanResult({
        first_name: 'Unknown',
        last_name: 'Scan',
        email: code.rawValue,
        rawValue: code.rawValue,
        timestamp: new Date().toLocaleTimeString(),
      })
    }
  })
}

const onError = (error: any) => {
  if (error.name === 'NotAllowedError') {
    errorInfo.value = 'Anda menolak izin kamera.'
  } else if (error.name === 'NotFoundError') {
    errorInfo.value = 'Tidak ada kamera yang terdeteksi.'
  } else {
    errorInfo.value = 'Terjadi kesalahan pada kamera.'
  }
}

const handleSaveScanned = () => {
  contactStore.saveScannedDataToContacts()
  showScanner.value = false
}

const getInitials = (fname: string, lname: string) => {
  return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
}

const displayedPages = computed(() => {
  const delta = 2
  const range = []
  for (
    let i = Math.max(2, currentPage.value - delta);
    i <= Math.min(totalPages.value - 1, currentPage.value + delta);
    i++
  ) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) range.unshift('...')
  if (currentPage.value + delta < totalPages.value - 1) range.push('...')

  range.unshift(1)
  if (totalPages.value !== 1) range.push(totalPages.value)

  return range
})

const getAvatarColor = (id: number) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  return colors[id % colors.length]
}

onMounted(async () => {
  await contactStore.fetchContacts(1)
  contactStore.syncAndRefresh()
})
</script>

<template>
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center">
      <i class="fas fa-users text-blue-400 text-2xl mr-3"></i>
      <div>
        <h1 class="text-2xl font-bold text-white">My Contacts</h1>
        <p v-if="lastUpdated" class="text-xs text-gray-400 mt-1">Last updated: {{ lastUpdated }}</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        @click="showScanner = true"
        class="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg border border-blue-400 shadow-lg transition-colors flex items-center gap-2"
        title="Scan Barcode/QR"
      >
        <span class="hidden md:inline text-sm font-semibold">Scan</span>
      </button>

      <div
        v-if="isSyncing"
        class="flex items-center bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm border border-yellow-500/20 animate-pulse"
      >
        <i class="fas fa-sync fa-spin mr-2"></i>
        <span>Syncing data...</span>
      </div>

      <button
        @click="contactStore.syncAndRefresh()"
        :disabled="isSyncing"
        class="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
        title="Force Sync"
      >
        <i class="fas fa-sync" :class="{ 'fa-spin': isSyncing }"></i>
      </button>

      <div class="text-gray-400 text-sm bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
        Total: <span class="text-blue-400 font-bold">{{ totalItems }}</span>
      </div>
    </div>
  </div>

  <div
    v-if="showScanner"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4 animate-fade-in"
  >
    <div
      class="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col md:flex-row overflow-hidden"
    >
      <div class="w-full md:w-1/2 bg-black relative flex flex-col justify-center">
        <div
          class="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs"
        >
          <i class="fas fa-video mr-1"></i> Live Camera
        </div>

        <QrcodeStream @detect="onDetect" @error="onError" class="h-full w-full object-cover">
          <div class="w-full h-full flex items-center justify-center">
            <div
              class="w-64 h-64 border-2 border-blue-500 border-dashed rounded-lg opacity-50"
            ></div>
          </div>
        </QrcodeStream>

        <div
          v-if="errorInfo"
          class="absolute bottom-4 left-0 right-0 text-center text-red-400 bg-black/80 p-2 text-sm mx-4 rounded-lg"
        >
          {{ errorInfo }}
        </div>
      </div>

      <div class="w-full md:w-1/2 flex flex-col bg-gray-800">
        <div class="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
          <h3 class="text-white font-bold text-lg">
            <i class="fas fa-list-ul mr-2 text-blue-400"></i> Scanned Results
          </h3>
          <button
            @click="contactStore.clearScannedResults()"
            class="text-xs text-red-400 hover:text-red-300"
          >
            Clear All
          </button>
        </div>

        <div class="flex-grow overflow-y-auto p-4 space-y-3">
          <div
            v-if="scannedResult.length === 0"
            class="h-full flex flex-col items-center justify-center text-gray-500 opacity-50"
          >
            <i class="fas fa-qrcode text-4xl mb-2"></i>
            <p>Arahkan kamera ke QR Code</p>
          </div>

          <div
            v-for="(item, index) in scannedResult"
            :key="index"
            class="bg-gray-700 p-3 rounded-lg border-l-4 border-blue-500 shadow-md animate-fade-in"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="text-white font-bold">{{ item.first_name }} {{ item.last_name }}</p>
                <p class="text-xs text-gray-300">{{ item.email }}</p>
                <p class="text-xs text-gray-300">{{ item.phone }}</p>
              </div>
              <span class="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded">{{
                item.timestamp
              }}</span>
            </div>
            <div class="mt-2 text-[10px] text-gray-500 font-mono break-all">
              Raw: {{ item.rawValue }}
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-700 bg-gray-900 flex gap-3">
          <button
            @click="showScanner = false"
            class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            @click="handleSaveScanned"
            :disabled="scannedResult.length === 0"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            <i class="fas fa-save mr-2"></i> Save Data
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1 mb-8">
    <!-- <div
      v-if="currentPage === 1"
      class="bg-gray-800 bg-opacity-40 rounded-xl shadow-custom overflow-hidden border-2 border-dashed border-gray-600 hover:border-blue-500 card-hover animate-fade-in group cursor-pointer"
    >
      <RouterLink
        to="/dashboard/contacts/create"
        class="block p-6 h-full flex flex-col items-center justify-center text-center"
      >
        <div
          class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
        >
          <i class="fas fa-plus text-2xl text-blue-400"></i>
        </div>
        <h2 class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
          Create New
        </h2>
        <p class="text-gray-400 text-sm mt-2">Add contact manually</p>
      </RouterLink>
    </div> -->

    <div
      v-for="contact in contacts"
      :key="contact.id"
      class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden card-hover animate-fade-in"
    >
      <div class="p-6">
        <RouterLink
          :to="`/dashboard/contacts/${contact.id}`"
          class="flex items-start mb-6 cursor-pointer group"
        >
          <div
            :class="[
              'w-14 h-14 rounded-full flex items-center justify-center mr-4 shadow-inner text-white font-bold text-xl shrink-0',
              getAvatarColor(contact.id),
            ]"
          >
            {{ getInitials(contact.first_name, contact.last_name) }}
          </div>

          <div class="overflow-hidden pt-1">
            <h2
              class="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors"
            >
              {{ contact.first_name }} {{ contact.last_name }}
            </h2>
            <p class="text-sm text-gray-400 truncate">{{ contact.email }}</p>
          </div>
        </RouterLink>

        <div class="h-px bg-gray-700 mb-4"></div>

        <div class="space-y-3 text-sm">
          <div class="flex items-center text-gray-300">
            <div class="w-8 flex justify-center text-gray-500">
              <i class="fas fa-user-tag"></i>
            </div>
            <span class="font-medium text-gray-400 w-20">Fullname</span>
            <span class="text-white truncate"
              >{{ contact.first_name }} {{ contact.last_name }}</span
            >
          </div>

          <div class="flex items-center text-gray-300">
            <div class="w-8 flex justify-center text-gray-500">
              <i class="fas fa-envelope"></i>
            </div>
            <span class="font-medium text-gray-400 w-20">Email</span>
            <span class="text-white truncate">{{ contact.email }}</span>
          </div>

          <div class="flex items-center text-gray-300">
            <div class="w-8 flex justify-center text-gray-500">
              <i class="fas fa-phone"></i>
            </div>
            <span class="font-medium text-gray-400 w-20">Phone</span>
            <span class="text-white">{{ contact.phone }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-900 bg-opacity-50 px-6 py-3 border-t border-gray-700 flex justify-end gap-2"
      >
        <RouterLink
          :to="`/dashboard/contacts/${contact.id}`"
          class="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center"
        >
          View Details <i class="fas fa-arrow-right ml-1"></i>
        </RouterLink>
      </div>
    </div>
  </div>

  <div v-if="totalPages > 1" class="flex justify-center pb-10">
    <nav class="flex items-center bg-gray-800 rounded-lg border border-gray-700 p-1 shadow-lg">
      <button
        @click="contactStore.changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        <i class="fas fa-chevron-left mr-2"></i> Prev
      </button>

      <div class="flex items-center px-2 space-x-1">
        <template v-for="(page, index) in displayedPages" :key="index">
          <span v-if="page === '...'" class="px-3 py-2 text-gray-500">...</span>

          <button
            v-else
            @click="contactStore.changePage(page as number)"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold transition-all',
              currentPage === page
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            ]"
          >
            {{ page }}
          </button>
        </template>
      </div>

      <button
        @click="contactStore.changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        Next <i class="fas fa-chevron-right ml-2"></i>
      </button>
    </nav>
  </div>
</template>

<style>
animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
