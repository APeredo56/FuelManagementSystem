import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FuelType } from "../../models/objects/FuelType";
import { PumpService } from "../../services/api/PumpService";
import { Pump } from "../../models/objects/Pump";
import { Routes } from "../../routes/CONSTANTS";
import NavbarComponent from "../../components/NavbarComponent";
import { Input, Switch } from "@material-tailwind/react";
import { StationService } from "../../services/api/StationService";

const PumpFormPage = () => {
    const { id } = useParams();
    const [code, setCode] = useState("");
    const [stationFuelTypes, setStationFuelTypes] = useState<FuelType[]>([]);
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<number[]>([]);
    const userStation = sessionStorage.getItem('userStationId');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validate = (): boolean => {
        if (code === "") {
            setError('Ingrese un nombre');
            return false;
        }
        if (selectedFuelTypes.length === 0) {
            setError('Seleccione al menos un tipo de combustible');
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (id) fetchPump();
        fetchStationFuelTypes();
    }, []);

    const fetchPump = () => {
        PumpService.get(Number(id)).then(response => {
            setCode(response.code);
            setSelectedFuelTypes(response.fuel_types!.map(f => f.id!));
        }).catch((error) => {
            console.log(error);
        });
    }

    const fetchStationFuelTypes = () => {
        StationService.getFuelTypes(Number(userStation)).then(response => {
            setStationFuelTypes(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        if (!id) {
            createPump();
        } else {
            updatePump();
        }
    }

    const createPump = () => {
        const newPump: Pump = {
            code: code,
            station: Number(userStation),
            fuel_types_ids: selectedFuelTypes
        }
        PumpService.create(newPump)
            .then(() => navigate(Routes.STATION.MANAGE))
            .catch(() => setError('Error al crear la bomba'));
    }

    const updatePump = () => {
        const newPump: Pump = {
            id: Number(id),
            code: code,
            station: Number(userStation),
            fuel_types_ids: selectedFuelTypes
        }
        PumpService.update(newPump)
            .then(() => navigate(Routes.STATION.MANAGE))
            .catch(() => setError('Error al actualizar la bomba'));
    }

    const handleFuelTypeChange = (fuelTypeId: number) => {
        if (selectedFuelTypes.includes(fuelTypeId)) {
            setSelectedFuelTypes(selectedFuelTypes.filter(id => id !== fuelTypeId));
        } else {
            setSelectedFuelTypes([...selectedFuelTypes, fuelTypeId]);
        }
    }

    return (<>
        <NavbarComponent />
        <main className="flex flex-col items-center mb-5">
            <h1 className="text-3xl text-secondary font-bold py-5">{id ? "Editar" : "Crear"} Surtidor</h1>
            <form className="w-96 bg-primary p-3 rounded-md border" onSubmit={(e) => onFormSubmit(e)}>
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="code"
                    value={code} onChange={(e) => setCode(e.target.value)}
                    type="text" crossOrigin={null} label="Código"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <div className="flex flex-wrap gap-2 mb-3">
                    {stationFuelTypes.map((fuelType) => (
                        <Switch key={"fuel-type-" + fuelType.id} crossOrigin={null} ripple={false}
                            className="h-full w-full checked:bg-secondary"
                            containerProps={{ className: "w-11 h-6" }}
                            circleProps={{ className: "before:hidden left-0.5 border-none" }}
                            label={fuelType.name} checked={selectedFuelTypes.includes(fuelType.id!)}
                            onChange={() => handleFuelTypeChange(fuelType.id!)}
                        />
                    ))}
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

export default PumpFormPage;