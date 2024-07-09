export const Routes = {
    LOGIN: '/login',
    HOME: '/',
    USER: {
        LIST: '/users',
        CREATE: '/users/create',
        EDIT: '/users/edit/:id',
        EDIT_PARAM: (id?: number) => `/users/edit/${id}`,
    },
    STATION: {
        LIST: '/stations',
        CREATE: '/stations/create',
        EDIT: '/stations/edit/:id',
        EDIT_PARAM: (id?: number) => `/stations/edit/${id}`,
    },
}