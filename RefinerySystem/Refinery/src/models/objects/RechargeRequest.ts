import { FuelType } from "./FuelType";
import { Route } from "./Route";
import { Station } from "./Station";

export interface RechargeRequest {
    id?: number;
    fuel_type: FuelType;
    fuel_type_id: number;
    fuel_quantity: number;
    station_id: number;
    station: Station;
    completed?: boolean;
    route?: Route;
    route_id?: number;
    deliver_order?: number;
}