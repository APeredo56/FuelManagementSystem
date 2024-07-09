import { Client } from "./Client";
import { FuelType } from "./FuelType";
import { Pump } from "./Pump";

export interface Sale {
    id?: number;
    sale_name: string;
    nit: number;
    client?: Client;
    client_id?: number;
    fuel_quantity: number;
    total?: number;
    fuel_price?: number;
    fuel_type?: FuelType;
    fuel_type_id?: number;
    pump?: Pump;
    pump_id?: number;
    date?: string;
    is_valid?: boolean;
}