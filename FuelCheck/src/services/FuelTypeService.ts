import { FuelType } from "../models/FuelType";
import api from "./interceptors";

export const FuelTypeService = {
    list: () => {
        return new Promise<FuelType[]>((resolve, reject) => {
            api.get(`fuel-types/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}