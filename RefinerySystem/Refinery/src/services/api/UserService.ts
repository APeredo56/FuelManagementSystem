import { User } from "../../models/objects/User";
import authAPI from "../interceptors/AuthAPI";

export const UserService = {
    getDrivers: () => {
        return new Promise<User[]>((resolve, reject) => {
            authAPI.get('users/drivers/')
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<User>((resolve, reject) => {
            authAPI.get(`users/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
}