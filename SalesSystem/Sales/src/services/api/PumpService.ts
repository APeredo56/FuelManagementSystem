import { Pump } from "../../models/objects/Pump";
import salesAPI from "../interceptors/SalesAPI";

export const PumpService = {
    getByStation: (stationId: number) => {
        return new Promise<Pump[]>((resolve, reject) => {
            salesAPI.get('pumps/by-station/' + stationId)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Pump>((resolve, reject) => {
            salesAPI.get(`pumps/${id}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    create: (Pump: Pump) => {
        return new Promise<Pump>((resolve, reject) => {
            salesAPI.post('pumps/', Pump)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    update: (Pump: Pump) => {
        return new Promise<Pump>((resolve, reject) => {
            salesAPI.put(`pumps/${Pump.id}/`, Pump)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise<Pump>((resolve, reject) => {
            salesAPI.delete(`pumps/${id}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
}