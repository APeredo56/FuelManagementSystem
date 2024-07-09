import { FuelType } from "./FuelType";

export interface Pump {
    id? : number;
    code: string;
    station: number;
    fuel_types?: FuelType[];
    fuel_types_ids?: number[];
}