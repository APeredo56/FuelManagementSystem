import { FuelStock } from "../models/FuelStock";
import api from "./interceptors";

export const FuelStockService = {
    getByFuelType: (fuelTypeId: number) => {
        return new Promise<FuelStock[]>((resolve, reject) => {
            api.get(`fuel-stock/by-fuel-type/${fuelTypeId}/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}