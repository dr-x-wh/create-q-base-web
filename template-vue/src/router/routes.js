const routesFormat = (routes) => {
    routes.sort((a, b) => b.path.split('/').filter(Boolean).length - a.path.split('/').filter(Boolean).length)
    const nodeMap = new Map(routes.map(s => [s.path, s]))
    const result = []

    for (const currentNode of routes) {
        const pathParts = currentNode.path.split('/').filter(Boolean)
        let parentPath = null


        for (let i = pathParts.length - 1; i >= 1; i--) {
            const parentParts = pathParts.slice(0, i)
            const candidate = `/${parentParts.join('/')}`

            if (nodeMap.has(candidate)) {
                parentPath = candidate
                break
            }
        }

        if (parentPath) {
            const parentNode = nodeMap.get(parentPath)
            if (parentNode?.children) {
                parentNode.children.push(currentNode)
            } else {
                parentNode.children = [currentNode]
            }
        } else {
            result.push(currentNode)
        }
    }

    return result
}

const clearPath = (list) => {
    return list.map(i => {
        i.path = i.path.replaceAll('/index', '') || '/'
        if (i?.children) i.children = clearPath(i.children)
        return i
    })
}

const getRoutes = () => {
    const pages = import.meta.glob('../views/**/page.js', {eager: true, import: 'default'})
    const components = import.meta.glob('../views/**/index.vue')
    let routes = Object.entries(pages).map(([fullPath, meta]) => {
        const path = fullPath.replace('../views', '').replace('/page.js', '')
        const name = path.split('/').filter(Boolean).join('-')
        const comPath = fullPath.replace('page.js', 'index.vue')
        return {path, name, component: components[comPath], meta}
    })
    routes = routesFormat(routes)
    routes = clearPath(routes)
    routes.push({
        path: '/:path(.*)*',
        name: 'error',
        component: () => import('@/views/error/index.vue'),
        meta: {online: false}
    })
    return routes
}

export default getRoutes()
