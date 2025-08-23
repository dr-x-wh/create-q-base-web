import request from "@/utils/request.js";

export function useSendCode(phone) {
    return request.post('/code', {phone})
}
