import { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { Sale } from "../../models/objects/Sale";
import { SaleService } from "../../services/api/SaleService";
import { Button } from "@material-tailwind/react";
import { ROLE_IDS } from "../../utilities/constants";
interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions { }

const SaleListPage = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const stationId = sessionStorage.getItem('userStationId');
    const userRole = Number(sessionStorage.getItem('userRole'));
    const options: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = () => {
        SaleService.getByStation(Number(stationId)).then(response => {
            setSales(response);
        });
    }

    const cancelSale = (id: number) => {
        SaleService.cancel(id).then(() => {
            fetchSales();
        });
    }

    const getFormattedDate = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('es-ES', options);
    }

    return (<>
        <NavbarComponent />
        <main className="px-20">
            <h1 className="text-3xl text-secondary font-bold py-5">Registro de Ventas</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr className="border-b-2 border-secondary p-1">
                        <th className="text-lg ps-3 text-left">Nombre</th>
                        <th className="text-lg ps-3 text-left">Nit</th>
                        <th className="text-lg ps-3 text-left">Bomba</th>
                        <th className="text-lg ps-3 text-left">Combustible</th>
                        <th className="text-lg ps-3 text-left">Cantidad</th>
                        <th className="text-lg ps-3 text-left">Total</th>
                        <th className="text-lg ps-3 text-left">Fecha</th>
                        <th className="text-lg ps-3 text-left">Cliente</th>
                        <th className="text-lg ps-3 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => <tr key={"cat-" + sale.id}>
                        <td className="ps-3 pt-2">{sale.sale_name}</td>
                        <td className="ps-3 pt-2">{sale.nit}</td>
                        <td className="ps-3 pt-2">{sale.pump?.code}</td>
                        <td className="ps-3 pt-2">{sale.fuel_type?.name}</td>
                        <td className="ps-3 pt-2">{sale.fuel_quantity} lt</td>
                        <td className="ps-3 pt-2">{sale.fuel_quantity} Bs</td>
                        <td className="ps-3 pt-2">{getFormattedDate(sale.date!)}</td>
                        <td className="ps-3 pt-2">{sale.client?.name + " " + sale.client?.last_name}</td>
                        <td className="ps-3 pt-2 text-center">
                            {userRole === ROLE_IDS.STATION_MANAGER ? <Button type="button"
                                size="sm" color="red" disabled={!sale.is_valid}
                                className="border-2 border-red-900 normal-case text-sm p-2"
                                onClick={() => { cancelSale(sale.id!) }}>
                                {sale.is_valid ? "Cancelar" : "Cancelada"}
                            </Button> :
                                <p className="text-red-600 font-bold">
                                    {sale.is_valid ? "" : "Cancelada"}
                                </p>}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </main>
    </>);
}

export default SaleListPage;