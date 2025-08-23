import request from "@/utils/request.js"

export function useGetList(query) {
    return request.get('/notice/list', {params: query})
}
