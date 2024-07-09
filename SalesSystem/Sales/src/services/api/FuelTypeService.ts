import { FuelType } from "../../models/objects/FuelType";
import salesAPI from "../interceptors/SalesAPI"

export const FuelTypeService = {
    list: () => {
        return new Promise<FuelType[]>((resolve, reject) => {
            salesAPI.get('fuel-types/')
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}