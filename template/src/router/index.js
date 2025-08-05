import {createRouter, createWebHistory} from "vue-router"
import guard from "@/router/guard.js"
import routes from "@/router/routes.js"

const router = createRouter({
    history: createWebHistory(), routes
})

router.beforeEach(guard)

export default router
