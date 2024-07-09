import { Station } from "../models/objects/Station";
import api from "./Interceptors"

export const StationService = {
    list: () => {
        return new Promise<Station[]>((resolve, reject) => {
            api.get('stations/')
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Station>((resolve, reject) => {
            api.get(`stations/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    create: (Station: Station) => {
        return new Promise<Station>((resolve, reject) => {
            api.post('stations/', Station)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    update: (Station: Station) => {
        return new Promise<Station>((resolve, reject) => {
            api.put(`stations/${Station.id}/`, Station)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise<Station>((resolve, reject) => {
            api.delete(`stations/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}