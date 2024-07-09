export const Routes = {
    HOME: '/',
    STATION: {
        LIST: '/stations',
        CREATE: '/stations/create',
        EDIT: '/stations/edit/:id',
        EDIT_PARAM: (id?: number) => `/stations/edit/${id}`,
    },
}