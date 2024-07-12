import { FuelType } from "../../models/objects/FuelType";
import refineryAPI from "../interceptors/RefineryAPI"

export const FuelTypeService = {
    list: () => {
        return new Promise<FuelType[]>((resolve, reject) => {
            refineryAPI.get('fuel-types/')
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}