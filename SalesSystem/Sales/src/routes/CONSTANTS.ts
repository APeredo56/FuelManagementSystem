export const Routes = {
    LOGIN: '/login',
    HOME: '/',
    STATION: {
        MANAGE: '/station/manage',
    },
    SALE: {
        LIST: '/sales/list',
        CREATE: '/sales/create',
    },
    PUMP: {
        CREATE: '/pumps/create',
        EDIT: '/pumps/edit/:id',
        EDIT_PARAM: (id?: number) => `/pumps/edit/${id}`,
    },
}   