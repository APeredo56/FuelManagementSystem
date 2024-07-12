export const Routes = {
    HOME: {
        ADMIN: '/admin',
        DRIVER: '/',
    },
    LOGIN: '/login',
    TRUCK: {
        LIST: '/trucks',
        CREATE: '/trucks/create',
        EDIT: '/trucks/edit/:id',
        EDIT_PARAM: (id?: number) => `/trucks/edit/${id}`,
    },
    ROUTE: {
        LIST: '/routes',
        CREATE: '/routes/create',
        EDIT: '/routes/edit/:id',
        EDIT_PARAM: (id?: number) => `/routes/edit/${id}`,
        DETAIL: '/routes/detail/:id',
        DETAIL_PARAM: (id?: number) => `/routes/detail/${id}`,
    },
}