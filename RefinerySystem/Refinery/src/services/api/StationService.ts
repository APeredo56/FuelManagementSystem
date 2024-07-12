import { Station } from "../../models/objects/Station";
import refineryAPI from "../interceptors/RefineryAPI"

export const StationService = {
    get: (id: number) => {
        return new Promise<Station>((resolve, reject) => {
            refineryAPI.get(`stations/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}