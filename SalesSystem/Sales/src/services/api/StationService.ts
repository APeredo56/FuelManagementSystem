import { FuelType } from "../../models/objects/FuelType";
import { Station } from "../../models/objects/Station";
import salesAPI from "../interceptors/SalesAPI"

export const StationService = {
    get: (id: number) => {
        return new Promise<Station>((resolve, reject) => {
            salesAPI.get(`stations/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    assignFuelTypes: (stationId: number, fuelTypes: number[]) => {
        return new Promise<void>((resolve, reject) => {
            salesAPI.post(`stations/${stationId}/assign-fuel-types/`, {fuel_types_ids: fuelTypes})
            .then(() => resolve())
            .catch(error => reject(error))
        });
    },
    getFuelTypes: (stationId: number) => {
        return new Promise<FuelType[]>((resolve, reject) => {
            salesAPI.get(`stations/${stationId}/fuel-types/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    }
}