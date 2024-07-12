import { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { Routes } from "../../routes/CONSTANTS";
import { Button } from "@material-tailwind/react";
import { Truck } from "../../models/objects/Truck";
import { TruckService } from "../../services/api/TruckService";
import { User } from "../../models/objects/User";
import { UserService } from "../../services/api/UserService";

const TruckListPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchTrucks();
        fetchUsers();
    }, []);

    const fetchTrucks = () => {
        TruckService.list().then(response => {
            setTrucks(response);
        });
    }

    const fetchUsers = () => {
        UserService.getDrivers().then(response => {
            setUsers(response);
        });
    }

    const deleteTruck = (id: number) => {
        TruckService.delete(id).then(() => {
            fetchTrucks();
        });
    }

    const getUserForDisplay = (id: number) => {
        const user = users.find(user => user.id === id);
        return user ? `${user.first_name} ${user.last_name}` : "No asignado";
    }

    const isIncludedInSearch = (truck: Truck) => {
        if (searchTerm === "") return true
        if (truck.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            truck.model.toLowerCase().includes(searchTerm.toLowerCase())) return true
        return false
    }

    return (<>
        <NavbarComponent />
        <main className="px-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl text-secondary font-bold py-8 w-fit text-nowrap">Administrar Camiones</h1>
                <div className="relative h-10 min-w-[200px]">
                    <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                            aria-hidden="true" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                        </svg>
                    </div>
                    <input
                        className="placeholder:text-white peer h-full w-full rounded-[7px] border border-white border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-white focus:border-2 focus:border-secondary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" " id="search" onChange={(e) => setSearchTerm(e.target.value)} />
                    <label htmlFor="search"
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-white peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-secondary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-secondary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-secondary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Buscar
                    </label>
                </div>
                <a href={Routes.TRUCK.CREATE}>
                    <Button type="button" size="sm" className="bg-secondary border-2">Agregar</Button>
                </a>
            </div>
            <table className="table-auto w-full">
                <thead>
                    <tr className="border-b-2 border-secondary p-1">
                        <th className="text-lg ps-3 text-left">Placa</th>
                        <th className="text-lg ps-3 text-left">Modelo</th>
                        <th className="text-lg ps-3 text-left">Capacidad</th>
                        <th className="text-lg ps-3 text-left">Conductor Asignado</th>
                        <th className="text-lg ps-3 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {trucks.map((truck) => isIncludedInSearch(truck) &&
                        <tr key={"cat-" + truck.id}>
                            <td className="ps-3 pt-2">{truck.plate}</td>
                            <td className="ps-3 pt-2">{truck.model}</td>
                            <td className="ps-3 pt-2">{truck.capacity}</td>
                            <td className="ps-3 pt-2">
                                {getUserForDisplay(truck.user_id!)}
                            </td>
                            <td className="ps-3 pt-2">
                                <a href={Routes.TRUCK.EDIT_PARAM(truck.id)} className="me-2">
                                    <Button type="button" size="sm" className="bg-secondary border-2">
                                        Editar
                                    </Button>
                                </a>
                                <Button type="button" size="sm" color="red" className="border-2 border-red-900"
                                    onClick={() => { deleteTruck(truck.id!) }}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>)}
                </tbody>
            </table>
        </main>
    </>);
}

export default TruckListPage;