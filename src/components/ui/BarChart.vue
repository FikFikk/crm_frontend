<template>
  <div class="w-full h-full">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { Chart } from 'chart.js/auto'

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

const props = defineProps<{
  data: ChartData
  height?: number
}>()

const canvasEl = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

const createChart = () => {
  if (!canvasEl.value) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = canvasEl.value.getContext('2d')
  if (!ctx) return

  // Clone data and override bar color with green theme

  // Force override ALL bar colors to green, ignoring any color from parent
  const greenData = {
    ...props.data,
    datasets: props.data.datasets.map(ds => {
      // Remove any existing color to avoid blue fallback
      const { backgroundColor, borderColor, ...rest } = ds
      // Use the same green as Tailwind bg-primary (default: #059669) and bg-primary/70
      return {
        ...rest,
        backgroundColor: 'rgba(5, 150, 105, 0.7)', // #059669 with 70% opacity
        borderColor: '#059669', // Tailwind bg-primary
      }
    })
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: greenData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(148, 163, 184, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.data = props.data
    chartInstance.update()
  } else {
    createChart()
  }
}, { deep: true })

onMounted(() => {
  createChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>