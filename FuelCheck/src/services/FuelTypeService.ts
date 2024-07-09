import { FuelType } from "../models/FuelType";
import api from "./interceptors";

export const FuelStockService = {
    list: () => {
        return new Promise<FuelType[]>((resolve, reject) => {
            api.get(`fuel-type/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}