import request from "@/utils/request.js";

export function useRegister(data) {
    return request.post('/user', data)
}
