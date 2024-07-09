import { Station } from "./Station";

export interface User {
    id?: number,
    first_name: string,
    last_name: string,
    email: string;
    phone: string;
    username: string;
    password?: string;
    role: number;
    station_id?: number;
    station?: Station;
}