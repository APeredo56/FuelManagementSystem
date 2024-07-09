import { FuelStock } from "../../models/objects/FuelStock";
import salesAPI from "../interceptors/SalesAPI";

export const StockService = {
    getByStation: (stationId: number) => {
        return new Promise<FuelStock[]>((resolve, reject) => {
            salesAPI.get(`fuel-stock/by-station/${stationId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}