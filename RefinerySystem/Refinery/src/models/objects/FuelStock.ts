import { FuelType } from "./FuelType";
import { Station } from "./Station";

export interface FuelStock {
    id?: number;
    fuel_type?: FuelType;
    fuel_type_id?: number;
    quantity: number;
    station?: Station;
    station_id?: number;
    price: number;
}