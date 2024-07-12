import { Truck } from "../../models/objects/Truck";
import refineryAPI from "../interceptors/RefineryAPI";

export const TruckService = {
    list: () => {
        return new Promise<Truck[]>((resolve, reject) => {
            refineryAPI.get('trucks/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Truck>((resolve, reject) => {
            refineryAPI.get(`trucks/${id}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    create: (Truck: Truck) => {
        return new Promise<Truck>((resolve, reject) => {
            refineryAPI.post('trucks/', Truck)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    update: (Truck: Truck) => {
        return new Promise<Truck>((resolve, reject) => {
            refineryAPI.put(`trucks/${Truck.id}/`, Truck)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise<Truck>((resolve, reject) => {
            refineryAPI.delete(`trucks/${id}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    getReady: () => {
        return new Promise<Truck[]>((resolve, reject) => {
            refineryAPI.get('trucks/ready/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
}