import { Client } from "../../models/objects/Client";
import salesAPI from "../interceptors/SalesAPI";

export const ClientService = {
    list: () => {
        return new Promise<Client[]>((resolve, reject) => {
            salesAPI.get('clients/')
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    create: (client: Client) => {
        return new Promise<Client>((resolve, reject) => {
            salesAPI.post('clients/', client)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    }
}