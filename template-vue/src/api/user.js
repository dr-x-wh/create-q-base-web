import request from "@/utils/request.js"

export function useLogin(data) {
    return request.post('/login', data)
}

export function useLogout(data) {
    return request.post('/logout', data)
}

export function useGetInfo() {
    return request.get('/user/info')
}
