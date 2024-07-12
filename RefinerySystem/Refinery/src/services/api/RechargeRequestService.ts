import { RechargeRequest } from "../../models/objects/RechargeRequest";
import refineryAPI from "../interceptors/RefineryAPI";

export const RechargeRequestService = {
    getUncompleted: (fuelTypeId: number) => {
        return new Promise<RechargeRequest[]>((resolve, reject) => {
            refineryAPI.get(`recharge-requests/uncompleted-by-fuel-type/${fuelTypeId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    update: (rechargeRequest: RechargeRequest) => {
        return new Promise<RechargeRequest>((resolve, reject) => {
            refineryAPI.put(`recharge-requests/${rechargeRequest.id}/`, rechargeRequest)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    getByRoute: (routeId: number) => {
        return new Promise<RechargeRequest[]>((resolve, reject) => {
            refineryAPI.get(`recharge-requests/by-route/${routeId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    complete: (rechargeRequest: RechargeRequest) => {
        return new Promise<RechargeRequest>((resolve, reject) => {
            refineryAPI.put(`recharge-requests/${rechargeRequest.id}/complete/`, rechargeRequest)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    }
}