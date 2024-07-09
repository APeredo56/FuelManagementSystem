import { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
import { Pump } from "../../models/objects/Pump";
import { FuelStock } from "../../models/objects/FuelStock";
import { PumpService } from "../../services/api/PumpService";
import { StockService } from "../../services/api/StockService";
import { Sale } from "../../models/objects/Sale";
import { SaleService } from "../../services/api/SaleService";
import { Routes } from "../../routes/CONSTANTS";
import { Button, Input, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { changeInput } from "../../utilities/FormUtils";
import { Client } from "../../models/objects/Client";
import { ClientService } from "../../services/api/ClientService";
import AddClientModal from "../../components/modals/AddClientModal";

const SaleCreatePage = () => {
    const emptyClient = { name: "", last_name: "", email: "", phone: "" };
    const emptyFuelStock = { quantity: 0, station_id: 0, price: 0 };
    const [error, setError] = useState("");
    const [pumps, setPumps] = useState<Pump[]>([]);
    const [stock, setStock] = useState<FuelStock[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client>(emptyClient);
    const [selectedStock, setSelectedStock] = useState<FuelStock>(emptyFuelStock);
    const [clientSearch, setClientSearch] = useState("");
    const [clientMenuOpen, setClientMenuOpen] = useState(false);
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const stationId = sessionStorage.getItem('userStationId');
    const navigate = useNavigate();

    type Inputs = {
        name: string,
        nit: string,
        client: number,
        quantity: string,
        fuelType: string,
        pump: string
    }

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        nit: "",
        client: 0,
        quantity: "",
        fuelType: "0",
        pump: "0"
    });

    const validate = (newInputs: Inputs): Errors => {
        const newErrors: Errors = {}
        if (!newInputs.name) newErrors.name = true
        if (!newInputs.nit) newErrors.nit = true
        if (newInputs.client === 0) newErrors.client = true
        if (!newInputs.quantity) newErrors.quantity = true
        if (newInputs.fuelType === "0") newErrors.fuelType = true
        if (newInputs.pump === "0") newErrors.pump = true

        if (newInputs.quantity && newInputs.fuelType !== "0") {
            if (!selectedStock.id) {
                newErrors.fuelType = true;
                setError('No hay Stock disponible para realizar la venta');
            } else if (Number(newInputs.quantity) > selectedStock.quantity) {
                newErrors.quantity = true;
                setError('No hay suficiente stock para realizar la venta');
            }
        }


        return newErrors
    }

    type Errors = Partial<Record<keyof Inputs, boolean>>
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        fetchPumps();
        fetchStock();
        fetchClients();
    }, []);

    useEffect(() => {
        if (inputs.fuelType === "0") {
            setSelectedStock(emptyFuelStock);
            return;
        }
        const selectedStock = stock.find(stock => stock.fuel_type?.id === Number(inputs.fuelType));
        setSelectedStock(selectedStock || emptyFuelStock);
    }, [inputs.fuelType]);

    const fetchPumps = () => {
        PumpService.getByStation(Number(stationId)).then(response => setPumps(response));
    }

    const fetchStock = () => {
        StockService.getByStation(Number(stationId)).then(response => setStock(response));
    }

    const fetchClients = () => {
        ClientService.list().then(response => setClients(response));
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
        createSale();
    }

    const createSale = () => {
        const newSale: Sale = {
            sale_name: inputs.name,
            client_id: inputs.client,
            fuel_quantity: Number(inputs.quantity),
            nit: Number(inputs.nit),
            fuel_type_id: Number(inputs.fuelType),
            pump_id: Number(inputs.pump)
        };
        SaleService.create(newSale)
            .then(() => navigate(Routes.SALE.LIST))
            .catch(() => setError('Error al realizar la venta'));
    }

    const getClientForDisplay = (client: Client) => {
        return client.name + " " + client.last_name;
    }

    const handleClientChange = (client: Client) => {
        setSelectedClient(client);
        setInputs({ ...inputs, client: client.id! });
        setErrors({ ...errors, client: false });
        setClientMenuOpen(false);
    }

    const handleFilterClients = (client: Client) => {
        return client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
            client.last_name.toLowerCase().includes(clientSearch.toLowerCase());
    }

    return (<>
        <NavbarComponent />
        <main className="flex flex-col items-center mb-5">
            <h1 className="text-3xl text-secondary font-bold py-5">Realizar Venta</h1>
            <form className="grid grid-cols-2 gap-3" onSubmit={(e) => onFormSubmit(e)}>
                <div className="w-96 bg-primary p-3 rounded-md border">
                    <Input className="text-white focus:border-secondary focus:border-t-transparent
                            peer-focus:before:!border-secondary mb-3" name="name"
                        value={inputs.name} onChange={(e) => changeInput(e, setInputs, setErrors)}
                        type="text" crossOrigin={null} error={errors.name} label="Nombre de Factura"
                        labelProps={{
                            className: "peer-focus:before:!border-secondary " +
                                "peer-focus:after:!border-secondary peer-focus:text-secondary",
                        }}
                        containerProps={{ className: "mb-3" }} />
                    <Input className="text-white focus:border-secondary focus:border-t-transparent
                            peer-focus:before:!border-secondary mb-3" name="nit"
                        value={inputs.nit} onChange={(e) => changeInput(e, setInputs, setErrors)}
                        type="number" crossOrigin={null} error={errors.nit} label="Nit"
                        labelProps={{
                            className: "peer-focus:before:!border-secondary " +
                                "peer-focus:after:!border-secondary peer-focus:text-secondary",
                        }}
                        containerProps={{ className: "mb-3" }} />
                    <Input className="text-white focus:border-secondary focus:border-t-transparent
                            peer-focus:before:!border-secondary mb-3" name="quantity"
                        value={inputs.quantity} onChange={(e) => changeInput(e, setInputs, setErrors)}
                        type="number" crossOrigin={null} error={errors.quantity} label="Cantidad de Combustible"
                        labelProps={{
                            className: "peer-focus:before:!border-secondary " +
                                "peer-focus:after:!border-secondary peer-focus:text-secondary",
                        }}
                        containerProps={{ className: "mb-3" }} />
                    <div className="mb-3">
                        <Typography className="text-secondary">Bomba</Typography>
                        <select value={inputs.pump} onChange={(e) => changeInput(e, setInputs, setErrors)}
                            className={`w-full p-2.5 bg-primary border border-blue-gray-200 rounded-md
                            focus:border-secondary focus:border-2 
                            ${errors.pump ? "border-red-500 text-red-500" : ""}`}
                            name="pump">
                            <option value={0}>Seleccione una Bomba</option>
                            {pumps.map(pump => (
                                <option key={pump.id} value={pump.id} className="">
                                    {pump.code}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <Typography className="text-secondary">Tipo de Combustible</Typography>
                        <select value={inputs.fuelType} onChange={(e) => changeInput(e, setInputs, setErrors)}
                            className={`w-full p-2.5 bg-primary border border-blue-gray-200 rounded-md
                            focus:border-secondary focus:border-2 
                            ${errors.fuelType ? "border-red-500 text-red-500" : ""}`}
                            name="fuelType">
                            {inputs.pump !== "0" ? <option value={0}>Seleccione un Tipo de Combustible</option> :
                                <option value={0}>Seleccione una Bomba primero</option>}
                            {inputs.pump !== "0" && pumps.find(pump => pump.id + "" === inputs.pump)?.fuel_types?.map(fuel => (
                                <option key={fuel.id} value={fuel.id} className="">
                                    {fuel.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="w-96 bg-primary p-3 rounded-md border">
                    <Menu placement="bottom-start" open={clientMenuOpen} handler={setClientMenuOpen}
                        dismiss={{ itemPress: false }}>
                        <MenuHandler>
                            <p className={`border border-blue-gray-200 p-2 rounded-md text-sm 
                                ${clientMenuOpen ? "border-2 border-secondary" : ""} 
                                ${errors.client ? "border-red-500 text-red-500" : ""}
                                ${inputs.client ? "text-white" : "text-blue-gray-500"}`}>
                                {inputs.client ? getClientForDisplay(selectedClient) : "Seleccionar Cliente"}
                            </p>
                        </MenuHandler>
                        <MenuList className="max-h-[20rem] max-w-[18rem] bg-primary">
                            <Input className="text-white focus:border-secondary focus:border-t-transparent
                            peer-focus:before:!border-secondary mb-3" value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                type="text" crossOrigin={null} error={errors.quantity} label="Buscar Clientes"
                                labelProps={{
                                    className: "peer-focus:before:!border-secondary " +
                                        "peer-focus:after:!border-secondary peer-focus:text-secondary",
                                }}
                                containerProps={{ className: "mb-3" }} />
                            {clients.map(client => handleFilterClients(client) && (
                                <MenuItem key={client.id}
                                    className="flex items-center gap-2 rounded-none border-t"
                                    onClick={() => handleClientChange(client)}>
                                    <p>{client.name + " " + client.last_name}</p>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Button size="sm" variant="text" className="text-secondary normal-case px-0 mb-3"
                        ripple={false} onClick={() => setClientModalOpen(true)}>
                        Agregar un Nuevo Cliente
                    </Button>
                    <h5 className="font-bold text-secondary">Stock Disponible: </h5>
                    <div className="flex justify-between items-center border-b-2 border-secondary py-2 mb-3">
                        {(() => {
                            if (inputs.fuelType === "0") {
                                return <p className="text-white block">Seleccione un Tipo de Combustible</p>;
                            } else if (!selectedStock?.id) {
                                return <p className="text-white block">No hay Stock disponible</p>;
                            } else {
                                return (
                                    <>
                                        <p>{selectedStock.fuel_type?.name}</p>
                                        <p>{selectedStock.quantity} lt</p>
                                    </>
                                );
                            }
                        })()}
                    </div>
                    <div className="flex gap-2 mb-3">
                        <h5 className="font-bold text-secondary">Precio Por Litro: </h5>
                        {selectedStock.id && <p className="text-white">{selectedStock.price} Bs</p>}
                    </div>
                    <div className="flex gap-2">
                        <h5 className="font-bold text-secondary">Total: </h5>
                        {selectedStock.id && inputs.quantity &&
                            <p className="text-white">{selectedStock.price * Number(inputs.quantity)} Bs</p>}
                    </div>
                </div>
                <div className="mb-3 w-96 col-span-2 m-auto">
                    <p className="block text-md font-medium text-red-600 mb-1">
                        {error}
                    </p>
                    <button type="submit" className="w-full bg-secondary text-white py-2.5 rounded-md">
                        Guardar
                    </button>
                </div>
            </form>
        </main>
        <AddClientModal isOpen={clientModalOpen} handleOpen={() => {
            setClientModalOpen(false)
            fetchClients()
        }} />
    </>);
}

export default SaleCreatePage;