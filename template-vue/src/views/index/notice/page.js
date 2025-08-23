export default {
    title: '停电通知',//
    sort: 2,//
    hidden(userStore) {
        return userStore.role !== 'admin'
    },//
}
