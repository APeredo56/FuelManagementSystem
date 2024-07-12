import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes/CONSTANTS";
import { Button, Input, Typography } from "@material-tailwind/react";
import { changeInput } from "../../utilities/FormUtils";
import { TruckService } from "../../services/api/TruckService";
import { Truck } from "../../models/objects/Truck";
import { FuelType } from "../../models/objects/FuelType";
import { FuelTypeService } from "../../services/api/FuelTypeService";
import { Route } from "../../models/objects/Route";
import { RouteService } from "../../services/api/RouteService";
import { RechargeRequest } from "../../models/objects/RechargeRequest";
import { RechargeRequestService } from "../../services/api/RechargeRequestService";
import SelectStopsModal from "../../components/modals/SelectStopsModal";

const RouteFormPage = () => {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
    const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>([]);
    const [selectedRequests, setSelectedRequests] = useState<RechargeRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState("");
    const navigate = useNavigate();

    type Inputs = {
        fuelType: number,
        truck: number,
        name: string,
        fuelPrice: number,
        fuelQuantity: number,
    }

    const [inputs, setInputs] = useState<Inputs>({
        fuelType: 0,
        truck: 0,
        name: "",
        fuelPrice: 0,
        fuelQuantity: 0,
    });

    const validate = (newInputs: Inputs): Errors => {
        const newErrors: Errors = {}
        if (!newInputs.name) newErrors.name = true
        if (newInputs.truck == 0) newErrors.truck = true
        if (newInputs.fuelType == 0) newErrors.fuelType = true
        if (newInputs.fuelPrice === 0) newErrors.fuelPrice = true
        if (newInputs.fuelQuantity === 0) {
            newErrors.fuelQuantity = true
            setError("Seleccione al menos una parada");
        }

        return newErrors
    }

    type Errors = Partial<Record<keyof Inputs, boolean>>
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        fetchTrucks();
        fetchFuelTypes();
    }, []);

    useEffect(() => {
        inputs.fuelQuantity = 0;
        setSelectedRequests([]);

        if (inputs.fuelType === 0) return;
        RechargeRequestService.getUncompleted(inputs.fuelType).then(response => {
            setRechargeRequests(response)
        });
    }, [inputs.fuelType]);

    const fetchTrucks = () => {
        TruckService.getReady().then(response => setTrucks(response));
    }
    const fetchFuelTypes = () => {
        FuelTypeService.list().then(response => setFuelTypes(response));
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const validatedErrors = validate(inputs);
        setErrors(validatedErrors);
        const isValid = Object.keys(validatedErrors).length === 0;

        if (!isValid) {
            return;
        }
        createRoute();
    }

    const createRoute = () => {
        const newRoute: Route = {
            fuel_type_id: inputs.fuelType,
            truck_id: inputs.truck,
            name: inputs.name,
            fuel_price: inputs.fuelPrice,
            fuel_quantity: inputs.fuelQuantity,
        };
        RouteService.create(newRoute)
            .then((response) => { assignRoute(response.id!) })
            .catch(() => setError('Error al crear la ruta'));
    }

    const assignRoute = (routeId: number) => {
        console.log(routeId)
        const promises: Promise<RechargeRequest>[] = [];
        selectedRequests.forEach((request, index) => {
            request.deliver_order = index + 1;
            request.route_id = routeId;
            request.fuel_type_id = inputs.fuelType;
            promises.push(RechargeRequestService.update(request));
        });
        Promise.all(promises).then(() => navigate(Routes.ROUTE.LIST));
    }

    const handleOpenModal = () => {
        if (inputs.fuelType == 0) {
            setErrors({ ...errors, fuelType: true });
            return
        }
        if (inputs.truck == 0) {
            setErrors({ ...errors, truck: true });
            return
        }
        setIsModalOpen(true);
    }

    const handleRequestClick = (newRequest: RechargeRequest) => {
        setError("");
        const id = newRequest.id!;
        if (selectedRequests.includes(newRequest)) {
            setSelectedRequests(selectedRequests.filter(request => request.id !== id));
            setInputs({ ...inputs, fuelQuantity: inputs.fuelQuantity - newRequest.fuel_quantity });
            setErrors({ ...errors, fuelQuantity: false });
        } else {
            const selectedTruck = trucks.find(truck => truck.id == inputs.truck);
            if (selectedTruck && inputs.fuelQuantity + newRequest.fuel_quantity > selectedTruck.capacity) {
                return setError("El camión no puede llevar más combustible");
            }
            setSelectedRequests([...selectedRequests, newRequest]);
            setInputs({ ...inputs, fuelQuantity: inputs.fuelQuantity + newRequest.fuel_quantity });
            setErrors({ ...errors, fuelQuantity: false });
        }
    }

    const switchRequestUp = (index: number) => {
        if (index === 0) return;
        const newRequests = [...selectedRequests];
        [newRequests[index - 1], newRequests[index]] = [newRequests[index], newRequests[index - 1]];
        setSelectedRequests(newRequests);
    }

    const switchRequestDown = (index: number) => {
        if (index === selectedRequests.length - 1) return;
        const newRequests = [...selectedRequests];
        [newRequests[index + 1], newRequests[index]] = [newRequests[index], newRequests[index + 1]];
        setSelectedRequests(newRequests);
    }

    return (<>
        <NavbarComponent />
        <main className="px-20 mb-5">
            <h1 className="text-3xl text-secondary font-bold py-5">Crear Ruta</h1>
            <form className="grid grid-cols-2" onSubmit={(e) => onFormSubmit(e)}>
                <div className="w-96 bg-primary p-3 rounded-md border h-fit m-auto">
                    <div className="mb-3">
                        <Typography className="text-secondary">Tipo de Combustible</Typography>
                        <select value={inputs.fuelType} onChange={(e) => changeInput(e, setInputs, setErrors)}
                            className={`w-full p-2.5 bg-primary border border-blue-gray-200 rounded-md
                                focus:border-secondary focus:border-2 
                                ${errors.fuelType ? "border-red-500 text-red-500" : ""}`} name="fuelType">
                            <option value={0}>Seleccione un Tipo</option>
                            {fuelTypes.map(fuelType => (
                                <option key={fuelType.id} value={fuelType.id}>
                                    {fuelType.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <Typography className="text-secondary">Camión</Typography>
                        <select value={inputs.truck} onChange={(e) => changeInput(e, setInputs, setErrors)}
                            className={`w-full p-2.5 bg-primary border border-blue-gray-200 rounded-md
                                focus:border-secondary focus:border-2 
                                ${errors.truck ? "border-red-500 text-red-500" : ""}`} name="truck">
                            <option value={0}>Seleccione un Camión</option>
                            {trucks.map(truck => (
                                <option key={truck.id} value={truck.id}>
                                    {truck.plate + " - " + truck.model + " - " + truck.capacity + " L"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input className="text-white focus:border-secondary focus:border-t-transparent
                            peer-focus:before:!border-secondary mb-3" name="name"
                        value={inputs.name} onChange={(e) => changeInput(e, setInputs, setErrors)}
                        type="text" crossOrigin={null} error={errors.name} label="Nombre de Ruta"
                        labelProps={{
                            className: "peer-focus:before:!border-secondary " +
                                "peer-focus:after:!border-secondary peer-focus:text-secondary",
                        }}
                        containerProps={{ className: "mb-3" }} />
                    <Input className="text-white focus:border-secondary focus:border-t-transparent
                            peer-focus:before:!border-secondary mb-3" name="fuelPrice"
                        value={inputs.fuelPrice} onChange={(e) => changeInput(e, setInputs, setErrors)}
                        type="number" crossOrigin={null} error={errors.fuelPrice} label="Precio por Litro"
                        labelProps={{
                            className: "peer-focus:before:!border-secondary " +
                                "peer-focus:after:!border-secondary peer-focus:text-secondary",
                        }}
                        containerProps={{ className: "mb-3" }} />
                    <Input className="text-white disabled:bg-transparent disabled:!border mb-3" name="fuelPrice"
                        value={inputs.fuelQuantity} disabled={true} type="number" crossOrigin={null}
                        label="Cantidad de Combustible"
                        labelProps={{
                            className: "peer-disabled:before:!border-blue-gray-200 " +
                                "peer-disabled:after:!border-blue-gray-200 peer-disabled:!text-secondary",
                        }}
                        containerProps={{ className: "mb-3" }} />
                    <div className="mb-3">
                        <p className="block text-md font-medium text-red-600 mb-1">
                            {error}
                        </p>
                        <button type="submit" className="w-full bg-secondary text-white py-2.5 rounded-md">
                            Guardar
                        </button>
                    </div>
                </div>

                <div className="bg-primary p-3 rounded-md border w-full h-[70vh] m-auto flex flex-col
                    flex-wrap items-center">
                    <Typography className="text-secondary text-2xl font-bold mb-3" as="h5">Paradas</Typography>
                    <Button type="button" size="sm" className="bg-secondary border-2 w-fit mx-auto mb-3"
                        onClick={() => handleOpenModal()}>
                        Seleccionar Paradas
                    </Button>
                    <div className="w-full h-[50vh] scroll-container overflow-auto">
                        <div className="w-full flex border-b-2 text-secondary py-1">
                            <Typography className="w-1/3 font-bold px-3">Surtidor</Typography>
                            <Typography className="w-1/3 font-bold px-3">Cantidad (L)</Typography>
                            <Typography className="w-1/3 font-bold px-3">Orden</Typography>
                            <div className="w-1/12"> </div>
                        </div>
                        {selectedRequests.map((request, index) => (
                            <div key={request.id} className="w-full flex border-b-2 py-1 items-center">
                                <Typography className="w-1/3 px-3">{request.station.name}</Typography>
                                <Typography className="w-1/3 px-3">{request.fuel_quantity} L</Typography>
                                <Typography className="w-1/3 px-3">{index + 1}</Typography>
                                <div className="h-[50px] w-1/12 flex flex-col px-3">
                                    <Button className="p-1 self-center"
                                        onClick={() => switchRequestUp(index)}>▲</Button>
                                    <Button className="p-1 self-center"
                                        onClick={() => switchRequestDown(index)}>▼</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </main>
        <SelectStopsModal rechargeRequests={rechargeRequests} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }}
            selectedRequests={selectedRequests} handleRequestClick={handleRequestClick} error={error}/>
    </>);
}

export default RouteFormPage;