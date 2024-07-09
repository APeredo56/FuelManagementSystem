import { User } from "../models/objects/User";
import { LoginRequest } from "../models/requests/LoginRequest";
import { AuthResponse } from "../models/responses/AuthResponse";
import api from "./Interceptors";

export const AuthService = {
    login: (request: LoginRequest) => {
        return new Promise<AuthResponse>((resolve, reject) => {
            api.post('token/', request)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    },
    me: () => {
        return new Promise<User>((resolve, reject) => {
            api.get('/users/me')
            .then(response => resolve(response.data))
            .catch(error => reject(error)) 
        });
    }
}