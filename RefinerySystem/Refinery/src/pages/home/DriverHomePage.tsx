import { useEffect, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent'
import { Route } from '../../models/objects/Route';
import { RouteService } from '../../services/api/RouteService';
import { Button, Typography } from '@material-tailwind/react';
import { RechargeRequestService } from '../../services/api/RechargeRequestService';
import { RechargeRequest } from '../../models/objects/RechargeRequest';
import { Station } from '../../models/objects/Station';
import AlertModal from '../../components/modals/AlertModal';

function DriverHomePage() {
	const userId = Number(sessionStorage.getItem('userId'));
	const mapsApiKey = import.meta.env.VITE_MAP_KEY;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const emptyRoute: Route = {
		fuel_price: 0,
		fuel_quantity: 0,
		name: "",
	}
	const [route, setRoute] = useState<Route>(emptyRoute);
	const [stops, setStops] = useState<RechargeRequest[]>([]);

	useEffect(() => {
		fetchRoute();
	}, []);

	const fetchRoute = () => {
		RouteService.getByDriver(userId).then(response => {
			setRoute(response);
			fetchStops(response.id!);
		});
	}

	const fetchStops = (routeId: number) => {
		RechargeRequestService.getByRoute(routeId).then(response => {
			setStops(response);
		});
	}

	const generateMapUrl = (station: Station) => {
		const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
		const params = [
			`center=${station.latitude},${station.longitude}`,
			'zoom=13',
			'size=250x250',
			`markers=color:red%7Clabel:C%7C${station.latitude},${station.longitude}`,
			`key=${mapsApiKey}`
		];
		return `${baseUrl}?${params.join('&')}`;
	}

	const completeStop = (stop: RechargeRequest, index: number) => {
		if (stops[index - 1] && !stops[index - 1].completed) {
			setIsModalOpen(true);
			return;
		}
		RechargeRequestService.complete(stop).then(() => {
			fetchStops(route.id!);
		});
	}

	return (<>
		<NavbarComponent />
		<main className="text-center px-20">
			{!route.id && <>
				<Typography as='h1' className="text-3xl text-secondary font-bold py-5">
					Bienvenido
				</Typography>
				<h2 className="text-xl text-white font-bold py-5">
					No tienes una ruta asignada
				</h2>
			</>}
			{route.id && <div className="flex justify-between py-5">
				<div className="flex flex-col">
					<Typography as='h1' className="text-start text-3xl text-secondary font-bold">
						{route.name}
					</Typography>
					<Typography className="text-secondary">
						{route.fuel_type?.name + ": "}<span className='text-white'>{"$" + route.fuel_price}</span>
					</Typography>
				</div>
				<div className="w-96 bg-primary border rounded-md p-3 grid grid-cols-3">
					<Typography className="text-secondary font-bold text-xl col-span-3">Camión</Typography>
					<Typography className="text-secondary">Placa:</Typography>
					<Typography className="text-secondary">Modelo:</Typography>
					<Typography className="text-secondary">Capacidad:</Typography>
					<Typography className="text-white">{route.truck?.plate}</Typography>
					<Typography className="text-white">{route.truck?.model}</Typography>
					<Typography className="text-white">{route.truck?.capacity} L</Typography>
				</div>
			</div>}
			{route.id && <div className="flex flex-wrap w-full gap-5">
				{stops.map((stop, index) => (
					<div key={stop.station?.id} className="bg-primary border rounded-md p-5 shadow-md w-80">
						<Typography className="text-lg font-bold text-secondary">
							{stop.deliver_order + " - " + stop.station?.name}
						</Typography>
						<a href={`https://www.google.com/maps?q=${stop.station?.latitude},${stop.station?.longitude}`}>
							<img src={generateMapUrl(stop.station)} alt="Mapa"
								className="object-cover mb-2" />
						</a>
						<Typography className="text-md text-secondary font-bold mb-1">
							Cantidad: <span className='text-white font-normal'>{stop.fuel_quantity} lt</span>
						</Typography>
						<Button className='bg-secondary border' size="sm" ripple={false}
							disabled={stop.completed} onClick={() => completeStop(stop, index)}>
							{stop.completed ? "Completado" : "Completar"}
						</Button>
					</div>
				))}
			</div>}
		</main>
		<AlertModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} 
			message='Debes completar las paradas en orden' />
	</>)
}

export default DriverHomePage
