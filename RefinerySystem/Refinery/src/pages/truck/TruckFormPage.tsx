import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { useNavigate, useParams } from "react-router-dom";
import { Routes } from "../../routes/CONSTANTS";
import { Input, Typography } from "@material-tailwind/react";
import { changeInput } from "../../utilities/FormUtils";
import { User } from "../../models/objects/User";
import { TruckService } from "../../services/api/TruckService";
import { UserService } from "../../services/api/UserService";
import { Truck } from "../../models/objects/Truck";

const TruckFormPage = () => {
    const { id } = useParams();
    const [drivers, setDrivers] = useState<User[]>([])
    const [error, setError] = useState("");
    const navigate = useNavigate();

    type Inputs = {
        plate: string,
        model: string,
        capacity: number,
        driver: number,
    }

    const [inputs, setInputs] = useState<Inputs>({
        plate: "",
        model: "",
        capacity: 0,
        driver: 0,
    });

    const validate = (newInputs: Inputs): Errors => {
        const newErrors: Errors = {}
        if (!newInputs.plate) newErrors.plate = true
        if (!newInputs.model) newErrors.model = true
        if (newInputs.capacity === 0) newErrors.capacity = true

        return newErrors
    }

    type Errors = Partial<Record<keyof Inputs, boolean>>
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (id) fetchTruck();
        fetchDrivers();
    }, []);

    const fetchTruck = () => {
        TruckService.get(Number(id)).then(response => {
            setInputs({
                plate: response.plate,
                model: response.model,
                capacity: response.capacity,
                driver: response.user_id ?? 0,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const fetchDrivers = () => {
        UserService.getDrivers().then(response => setDrivers(response));
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
        if (!id) {
            createTruck();
        } else {
            updateTruck();
        }
    }

    const createTruck = () => {
        const newTruck: Truck = {
            plate: inputs.plate,
            model: inputs.model,
            capacity: inputs.capacity,
            user_id: inputs.driver != 0 ? inputs.driver : undefined,
        };
        TruckService.create(newTruck)
            .then(() => navigate(Routes.TRUCK.LIST))
            .catch(() => setError('Error al crear el camión'));
    }

    const updateTruck = () => {
        const newTruck: Truck = {
            id: Number(id),
            plate: inputs.plate,
            model: inputs.model,
            capacity: inputs.capacity,
            user_id: inputs.driver != 0 ? inputs.driver : undefined,
        };
        TruckService.update(newTruck)
            .then(() => navigate(Routes.TRUCK.LIST))
            .catch(() => setError('Error al actualizar el camión'));
    }

    return (<>
        <NavbarComponent />
        <main className="flex flex-col items-center mb-5">
            <h1 className="text-3xl text-secondary font-bold py-5">{id ? "Editar" : "Crear"} Camión</h1>
            <form className="w-96 bg-primary p-3 rounded-md border" onSubmit={(e) => onFormSubmit(e)}>
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="plate"
                    value={inputs.plate} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="text" crossOrigin={null} error={errors.plate} label="Placa"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="model"
                    value={inputs.model} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="text" crossOrigin={null} error={errors.model} label="Modelo"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="capacity"
                    value={inputs.capacity} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="number" crossOrigin={null} error={errors.capacity} label="Capacidad"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <div className="mb-3">
                    <Typography className="text-secondary">Conductor</Typography>
                    <select value={inputs.driver} onChange={(e) => setInputs(prevInputs => ({
                        ...prevInputs,
                        driver: Number(e.target.value)
                    }))} className="w-full p-2.5 bg-primary border border-blue-gray-200 rounded-md
                        focus:border-secondary focus:border-2">
                        <option value={0}>Sin Conductor</option>
                        {drivers.map(driver => (
                            <option key={driver.id} value={driver.id!.toString()}>
                                {driver.first_name + " " + driver.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <p className="block text-md font-medium text-red-600 mb-1">
                        {error}
                    </p>
                    <button type="submit" className="w-full bg-secondary text-white py-2.5 rounded-md">
                        Guardar
                    </button>
                </div>
            </form>
        </main>
    </>);
}

export default TruckFormPage;