import {defineStore} from "pinia"

const useSettingStore = defineStore('setting', {
    state: () => ({
        transition: 'el-zoom-in-center',
    }),
    getters: {},
    actions: {},
})

export default useSettingStore
