import { Button } from "@material-tailwind/react";
import { Routes } from "../../routes/CONSTANTS";
import NavbarComponent from "../../components/NavbarComponent";
import { useEffect, useState } from "react";
import { Pump } from "../../models/objects/Pump";
import { PumpService } from "../../services/api/PumpService";
import AssignFuelTypesModal from "../../components/modals/AssignFuelTypesModal";
import { FuelType } from "../../models/objects/FuelType";
import { StationService } from "../../services/api/StationService";

const PumpManagementPage = () => {
    const [pumps, setPumps] = useState<Pump[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
    const [stationFuelTypes, setStationFuelTypes] = useState<FuelType[]>([]);
    const stationId = sessionStorage.getItem('userStationId');

    useEffect(() => {
        fetchPumps();
        fetchFuelTypes();
    }, []);

    const fetchPumps = () => {
        if (!stationId) return;
        PumpService.getByStation(Number(stationId)).then(response => {
            setPumps(response);
        });
    }

    const fetchFuelTypes = () => {
        StationService.getFuelTypes(Number(stationId)).then(response => {
            setStationFuelTypes(response);
        });
    }

    const deletePump = (id: number) => {
        PumpService.delete(id).then(() => {
            fetchPumps();
        });
    }

    const onFuelAssign = () => {
        setIsAssignModalOpen(false);
        fetchFuelTypes();
    }

    return (<>
        <NavbarComponent />
        <main className="px-20">
            <h1 className="text-3xl text-secondary font-bold py-8 w-fit text-nowrap">Administrar Surtidor</h1>
            <div className="grid grid-cols-2 gap-3 justify-items-center">
                <div className="w-full bg-primary rounded-md border p-3">
                    <div className="flex items-center justify-center gap-3 text-center">
                        <h5 className="text-xl font-bold text-secondary text-center">Bombas</h5>
                        <a href={Routes.PUMP.CREATE}>
                            <Button type="button" size="sm" className="rounded-full p-0 w-[35px] 
                                        h-[35px] bg-secondary text-md border-2">
                                <i className="fa-solid fa-plus"></i>
                            </Button>
                        </a>
                    </div>
                    {pumps.map((pump) => (
                        <div key={"pump-" + pump.id}
                            className="flex justify-between items-center border-b-2 border-secondary py-2">
                            <div className="flex gap-3 items-center flex-wrap">
                                <p>{pump.code}</p>
                                {pump.fuel_types?.map((fuel) => (
                                    <p key={"fuel-" + fuel.id} className="text-xs font-bold border bg-tertiary
                                        rounded-full p-1.5 m-0">
                                        {fuel.name}
                                    </p>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <a href={Routes.PUMP.EDIT_PARAM(pump.id)}>
                                    <Button type="button" size="sm" className="rounded-full p-0 w-[35px] 
                                        h-[35px] bg-secondary text-md border-2">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Button>
                                </a>
                                <Button type="button" size="sm" className="rounded-full p-0 w-[35px] h-[35px] 
                                    text-md border-2" color="red" onClick={() => deletePump(pump.id!)}>
                                    <i className="fa-solid fa-trash"></i>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-primary rounded-md border p-3">
                    <div className="flex items-center justify-center gap-3 text-center">
                        <h5 className="text-xl font-bold text-secondary text-center">Tipos de Combustible</h5>
                        <Button type="button" size="sm" className="rounded-full p-0 w-[35px] 
                            h-[35px] bg-secondary text-md border-2" onClick={() => setIsAssignModalOpen(true)}>
                            <i className="fa-solid fa-plus"></i>
                        </Button>
                    </div>
                    {stationFuelTypes.map((fuel) => (
                        <div key={"fuel-" + fuel.id}
                            className="flex justify-between items-center border-b-2 border-secondary py-2">
                            <p>{fuel.name}</p>
                        </div>
                    ))
                    }
                </div>
            </div>
        </main>
        <AssignFuelTypesModal isOpen={isAssignModalOpen} handleOpen={() => onFuelAssign()} />
    </>);
}

export default PumpManagementPage;