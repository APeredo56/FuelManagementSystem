import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Switch } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FuelType } from "../../models/objects/FuelType";
import { FuelTypeService } from "../../services/api/FuelTypeService";
import { StationService } from "../../services/api/StationService";

type Props = {
    isOpen: boolean,
    handleOpen: () => void,
}

const AssignFuelTypesModal = ({ isOpen, handleOpen }: Props) => {
    const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<number[]>([]);
    const stationId = sessionStorage.getItem('userStationId');

    useEffect(() => {
        fetchFuelTypes();
        fetchStationFuelTypes();
    }, []);

    const fetchFuelTypes = () => {
        FuelTypeService.list().then(response => {
            setFuelTypes(response);
        });
    }

    const fetchStationFuelTypes = () => {
        StationService.getFuelTypes(Number(stationId)).then(response => {
            setSelectedFuelTypes(response.map(f => f.id!));
        }).catch(error => console.log(error));
    }

    const handleFuelTypeChange = (fuelTypeId: number) => {
        if (selectedFuelTypes.includes(fuelTypeId)) {
            setSelectedFuelTypes(selectedFuelTypes.filter(id => id !== fuelTypeId));
        } else {
            setSelectedFuelTypes([...selectedFuelTypes, fuelTypeId]);
        }
    }

    const saveChanges = () => {
        StationService.assignFuelTypes(Number(stationId), selectedFuelTypes)
            .then(() => handleOpen())
            .catch(error => console.log(error));
    }

    return (<Dialog open={isOpen} handler={handleOpen} className="bg-primary border">
        <DialogHeader className="text-secondary border-0 border-b">Asignar Combustibles</DialogHeader>
        <DialogBody className="text-white">
            <div className="flex flex-wrap gap-2">
                {fuelTypes.map((fuelType) => (
                    <Switch key={"fuel-type-" + fuelType.id} crossOrigin={null} ripple={false}
                        className="h-full w-full checked:bg-secondary"
                        containerProps={{ className: "w-11 h-6" }}
                        circleProps={{ className: "before:hidden left-0.5 border-none" }}
                        label={fuelType.name} checked={selectedFuelTypes.includes(fuelType.id!)}
                        onChange={() => handleFuelTypeChange(fuelType.id!)}
                    />
                ))}
            </div>
        </DialogBody>
        <DialogFooter className="border-0 border-t">
            <Button variant="gradient" color="red" onClick={handleOpen} className="mr-1">
                <span>Cancelar</span>
            </Button>
            <Button className="bg-secondary" onClick={() => saveChanges()}>
                <span>Confirmar</span>
            </Button>
        </DialogFooter>
    </Dialog>);
}

export default AssignFuelTypesModal;