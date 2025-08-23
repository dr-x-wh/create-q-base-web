// 路由守卫
import useUserStore from "@/store/user.js";

export default async function (to, from) {
    if (to?.meta?.online === false) {
        return true
    } else {
        const userStore = useUserStore()
        if (userStore.getOnlineState()) {
            await userStore.getInfo()
            return true
        } else {
            return {path: '/login', query: {message: "请登陆后再试"}}
        }
    }
}
