import { useEffect, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent'
import { Routes } from '../../routes/CONSTANTS'
import { ROLE_IDS } from '../../utilities/constants';
import { StationService } from '../../services/api/StationService';

function HomePage() {
	const userRole = Number(sessionStorage.getItem('userRole'));
	const [station, setStation] = useState("");

	useEffect(() => {
		fetchStationName();
	}, []);

	const fetchStationName = () => {
		const stationId = sessionStorage.getItem('userStationId');
		if (!stationId) return;
		StationService.get(Number(stationId)).then(response => {
			setStation(response.name);
		}
		).catch((error) => {
			console.log(error);
		});
	}

	return (<>
		<NavbarComponent />
		<div className="text-center">
			<h1 className="text-3xl text-secondary font-bold py-5">
				{station ? `Bienvenido a ${station}` : "Bienvenido"}
			</h1>
			{!station && <h5 className='text-xl'>Aun no tienes un surtidor asignado</h5>}
			{station && <div className="flex flex-col m-auto w-96 gap-5">
				{userRole === ROLE_IDS.SALESPERSON && <a href={Routes.SALE.CREATE}
					className="bg-secondary p-1 text-lg text-primary font-bold border-2 rounded-md">
					Realizar Venta
				</a>}
				{userRole === ROLE_IDS.STATION_MANAGER && <a href={Routes.STATION.MANAGE}
					className="bg-secondary p-1 text-lg text-primary font-bold border-2 rounded-md">
					Administrar Surtidor
				</a>}
				<a href={Routes.SALE.LIST} className="bg-secondary p-1 text-lg text-primary font-bold 
					border-2 rounded-md">Registro de Ventas</a>
			</div>}
		</div>
	</>)
}

export default HomePage
