<script setup lang="ts">
import axios from 'axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

const BASE_URL = 'http://localhost:3000/api'

const toast = useToast()
const isGenerating = ref(false)
const showPreview = ref(false)
const pdfDownload = ref('')
const currentReportId = ref<number | null>(null)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const generatePdf = async () => {
  if (isGenerating.value) return
  isGenerating.value = true
  pdfDownload.value = ''

  try {
    const startRes = await axios.post(`${BASE_URL}/reports/generate`)
    const { reportId } = startRes.data
    currentReportId.value = reportId

    toast.add({
      severity: 'info',
      summary: 'Processing',
      detail: 'Membuat laporan PDF...',
      life: 3000,
    })

    let isComplete = false

    while (!isComplete) {
      await sleep(2000)

      const statusRes = await axios.get(`${BASE_URL}/reports/${reportId}`)

      const { status, file_data } = statusRes.data

      if (status === 'COMPLETED') {
        pdfDownload.value = file_data
        isComplete = true
        showPreview.value = true

        toast.add({
          severity: 'success',
          summary: 'Selesai',
          detail: 'Laporan siap didownload!',
          life: 3000,
        })
      } else if (status === 'FAILED') {
        throw new Error('Worker gagal memproses PDF.')
      }
    }
  } catch (error) {
    console.error('Gagal generate PDF', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal membuat laporan.', life: 3000 })
  } finally {
    isGenerating.value = false
  }
}

const downloadFile = () => {
  if (!pdfDownload.value) return

  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${pdfDownload.value}`
  link.download = `Report-Contact-${currentReportId.value}.pdf`
  link.click()
}
</script>
<template>
  <Button
    label="export pdf"
    :loading="isGenerating"
    @click="generatePdf"
    severity="success"
    outlined
  />

  <Dialog
    v-model:visible="showPreview"
    header="PDF Preview"
    :modal="true"
    :style="{ width: '80vw' }"
    :maximizable="true"
    dismissableMask
  >
    <div class="flex flex-col h-[70vh]">
      <iframe
        v-if="pdfDownload"
        :src="`data:application/pdf;base64,${pdfDownload}`"
        class="w-full h-full border rounded-lg bg-gray-100"
        type="application/pdf"
      ></iframe>

      <div v-else class="flex items-center justify-center h-full text-gray-500">
        <i class="pi pi-spin pi-spinner text-4xl"></i>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Tutup" icon="pi pi-times" text @click="showPreview = false" />
        <Button
          label="Download PDF"
          icon="pi pi-download"
          severity="danger"
          @click="downloadFile"
        />
      </div>
    </template>
  </Dialog>
</template>
