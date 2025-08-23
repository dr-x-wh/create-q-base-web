import request from "@/utils/request.js"

export function useGetList(query) {
    return request.get('/setting/list', {params: query})
}
export function useUpdate(data) {
    return request.patch('/setting', data)
}
