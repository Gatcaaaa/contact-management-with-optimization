<script setup lang="ts">
import { useContactStore } from '@/stores/contactStore'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const contactStore = useContactStore()

const contactId = Number(route.params.id)

const contact = computed(() => {
  return contactStore.contacts.find((contact) => contact.id === contactId)
})

const qrData = computed(() => {
  if (!contact.value) return ''

  const dataToEncode = {
    id: contact.value.id,
    first_name: contact.value.first_name,
    last_name: contact.value.last_name,
    email: contact.value.email,
    phone: contact.value.phone,
  }

  try {
    return JSON.stringify(dataToEncode)
  } catch (error) {
    console.error('Error encoding data:', error)
    return ''
  }
})

const qrCode = useQRCode(qrData)

const downloadQR = () => {
  if (!contact.value || !qrCode.value) return

  const link = document.createElement('a')
  link.href = qrCode.value
  link.download = `qr-${contact.value.first_name.toLowerCase()}-${contact.value.id}.png`
  link.click()
}

const getInitials = (fname: string, lname: string) =>
  `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
const getAvatarColor = (id: number) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500']
  return colors[id % colors.length]
}

onMounted(async () => {
  if (!contact.value) {
    await contactStore.fetchContacts(1)
    if (!contact.value) {
      router.push('/')
    }
  }
})
</script>

<template>
  <div class="max-w-full mx-auto animate-fade-in">
    <button
      @click="router.back()"
      class="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
    >
      <i class="fas fa-arrow-left mr-2"></i> Back to List
    </button>

    <div v-if="contact" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="md:col-span-2 bg-gray-800 bg-opacity-80 border border-gray-700 rounded-xl shadow-custom overflow-hidden"
      >
        <div class="p-8">
          <div class="flex items-center mb-8">
            <div
              :class="[
                'w-20 h-20 rounded-full flex items-center justify-center mr-6 shadow-lg text-white font-bold text-3xl',
                getAvatarColor(contact.id),
              ]"
            >
              {{ getInitials(contact.first_name, contact.last_name) }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white mb-1">
                {{ contact.first_name }} {{ contact.last_name }}
              </h1>
              <span
                class="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30"
              >
                Contact ID: #{{ contact.id }}
              </span>
            </div>
          </div>

          <div class="space-y-6">
            <div
              class="group bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors"
            >
              <label class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >Email Address</label
              >
              <div class="flex items-center mt-1 text-white text-lg">
                {{ contact.email }}
              </div>
            </div>

            <div
              class="group bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors"
            >
              <label class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >Phone Number</label
              >
              <div class="flex items-center mt-1 text-white text-lg">
                {{ contact.phone }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-800 bg-opacity-80 border border-gray-700 rounded-xl shadow-custom overflow-hidden flex flex-col"
      >
        <div class="p-4 bg-gray-900 border-b border-gray-700 text-center">
          <h2 class="text-white font-bold text-lg">QR Code</h2>
        </div>

        <div class="p-8 flex-grow flex flex-col items-center justify-center bg-gray-800">
          <div
            class="bg-white p-3 rounded-xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300"
          >
            <img v-if="qrCode" :src="qrCode" alt="Contact QR Code" class="w-48 h-48" />
          </div>

          <button
            @click="downloadQR"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center transition-all active:scale-95"
          >
            Download QR
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"
      ></div>
      <p class="text-gray-400">Loading contact details...</p>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
