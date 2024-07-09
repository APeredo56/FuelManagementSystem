import { Button } from "@material-tailwind/react";
import { Routes } from "../../routes/CONSTANTS";
import NavbarComponent from "../../components/NavbarComponent";
import { useEffect, useState } from "react";
import { Station } from "../../models/objects/Station";
import { StationService } from "../../services/StationService";

const StationListPage = () => {
    const [stations, setStations] = useState<Station[]>([]);

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = () => {
        StationService.list().then(response => {
            setStations(response);
        });
    }

    const deleteStation = (id: number) => {
        StationService.delete(id).then(() => {
            fetchStations();
        });
    }

    return (<>
        <NavbarComponent />
        <main className="px-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl text-secondary font-bold py-8 w-fit text-nowrap">Administrar Surtidores</h1>
                <a href={Routes.STATION.CREATE}>
                    <Button type="button" size="sm" className="bg-secondary border-2">Agregar</Button>
                </a>
            </div>
            <table className="table-auto w-full">
                <thead>
                    <tr className="border-b-2 border-secondary p-1">
                        <th className="text-lg ps-3 text-left">Nombre</th>
                        <th className="text-lg ps-3 text-left">Latitud</th>
                        <th className="text-lg ps-3 text-left">Longitud</th>
                        <th className="text-lg ps-3 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {stations.map((station) => <tr key={"cat-" + station.id}>
                        <td className="ps-3 pt-2">{station.name}</td>
                        <td className="ps-3 pt-2">{station.latitude}</td>
                        <td className="ps-3 pt-2">{station.longitude}</td>
                        <td className="ps-3 pt-2">
                            <a href={Routes.STATION.EDIT_PARAM(station.id)} className="me-2">
                                <Button type="button" size="sm" className="bg-secondary border-2">
                                    Editar
                                </Button>
                            </a>
                            <Button type="button" size="sm" color="red" className="border-2 border-red-900"
                                onClick={() => { deleteStation(station.id!) }}>
                                Eliminar
                            </Button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </main>
    </>);
}

export default StationListPage;