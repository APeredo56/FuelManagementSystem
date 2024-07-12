import { FuelType } from "./FuelType";
import { Truck } from "./Truck";

export interface Route {
    id?: number;
    fuel_type?: FuelType;
    fuel_type_id?: number;
    truck_id?: number;
    truck?: Truck;
    name: string;
    fuel_quantity: number;
    fuel_price: number;
    date?: string;
    completed?: boolean;
}