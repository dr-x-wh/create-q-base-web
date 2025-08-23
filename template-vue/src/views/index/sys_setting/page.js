export default {
    title: '停电通知设置',//
    sort: 3,//
    hidden(userStore) {
        return userStore.role !== 'admin'
    },//
}
