<template>
  <div class="header-actions">
    <button class="action-btn" title="Popout" @click="popout">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
        <path d="M3.5 1h9a2.5 2.5 0 012.5 2.5v9a2.5 2.5 0 01-2.5 2.5h-2v-1h2a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0012.5 2h-9A1.5 1.5 0 002 3.5v2h-1v-2A2.5 2.5 0 013.5 1z" />
        <path d="M1 6.5v4a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-4a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5zM2 7h3v3H2V7z" />
        <path d="M9.854 7.146l-3-3a.5.5 0 00-.708.708L8.293 7H5.5a.5.5 0 000 1h2.793l-2.147 2.146a.5.5 0 00.708.708l3-3a.5.5 0 000-.708z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  params: {
    group: any
    api: any
  }
}

const props = defineProps<Props>()

function popout() {
  const api = props.params?.containerApi
  const group = props.params?.group
  if (!api || !group) return
  api.addPopoutGroup(group)
}
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: #888;
  border-radius: 3px;
  cursor: pointer;
}
.action-btn:hover {
  background: #333;
  color: #ccc;
}
</style>
