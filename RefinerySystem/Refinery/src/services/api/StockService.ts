import { FuelStock } from "../../models/objects/FuelStock";
import refineryAPI from "../interceptors/RefineryAPI";

export const StockService = {
    getByStation: (stationId: number) => {
        return new Promise<FuelStock[]>((resolve, reject) => {
            refineryAPI.get(`fuel-stock/by-station/${stationId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}