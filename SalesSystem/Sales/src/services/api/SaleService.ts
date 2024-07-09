import { Sale } from "../../models/objects/Sale";
import salesAPI from "../interceptors/SalesAPI";

export const SaleService = {
    getByStation: (stationId: number) => {
        return new Promise<Sale[]>((resolve, reject) => {
            salesAPI.get('sales/by-station/' + stationId)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    create: (sale: Sale) => {
        return new Promise<Sale>((resolve, reject) => {
            salesAPI.post('sales/', sale)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    cancel: (id: number) => {
        return new Promise<Sale>((resolve, reject) => {
            salesAPI.post(`sales/${id}/cancel/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    }
}