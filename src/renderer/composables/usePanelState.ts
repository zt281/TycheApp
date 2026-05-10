import { reactive, watch, toRaw } from 'vue'

export function usePanelState(api: any, defaults: Record<string, unknown> = {}) {
  const state = reactive<Record<string, unknown>>({ ...defaults, ...(api.params || {}) })

  watch(
    () => state,
    () => {
      api.setParams(toRaw(state))
    },
    { deep: true, flush: 'post' }
  )

  return state
}
