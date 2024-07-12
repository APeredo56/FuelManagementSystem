import { Route } from "../../models/objects/Route";
import refineryAPI from "../interceptors/RefineryAPI";

export const RouteService ={
    list: () => {
        return new Promise<Route[]>((resolve, reject) => {
            refineryAPI.get('routes/')
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    create: (route: Route) => {
        return new Promise<Route>((resolve, reject) => {
            refineryAPI.post('routes/', route)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise<Route>((resolve, reject) => {
            refineryAPI.delete(`routes/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Route>((resolve, reject) => {
            refineryAPI.get(`routes/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    getByDriver: (driverId: number) => {
        return new Promise<Route>((resolve, reject) => {
            refineryAPI.get(`routes/by-driver/${driverId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    }
}