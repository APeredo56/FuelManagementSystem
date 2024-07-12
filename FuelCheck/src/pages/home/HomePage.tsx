import { useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent'
import { FuelType } from '../../models/FuelType'
import { FuelStock } from '../../models/FuelStock';
import { Option, Select, Typography } from '@material-tailwind/react';
import { FuelTypeService } from '../../services/FuelTypeService';
import { FuelStockService } from '../../services/FuelStockService';
import { Station } from '../../models/Station';

function HomePage() {
	const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
	const [fuelStock, setFuelStock] = useState<FuelStock[]>([]);
	const [selectedFuelType, setSelectedFuelType] = useState("0");
	const mapsApiKey = import.meta.env.VITE_MAP_KEY;

	useEffect(() => {
		fetchFuelTypes();
	}, []);

	useEffect(() => {
		fetchStock();
	}, [selectedFuelType]);

	const fetchFuelTypes = () => {
		FuelTypeService.list()
			.then(response => setFuelTypes(response))
			.catch(error => console.log(error));
	}

	const fetchStock = () => {
		if (selectedFuelType === "0") return;
		FuelStockService.getByFuelType(Number(selectedFuelType))
			.then(response => setFuelStock(response))
			.catch(error => console.log(error));
	}

	const generateMapUrl = (station: Station) => {
		const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
		const params = [
			`center=${station.latitude},${station.longitude}`,
			'zoom=13',
			'size=300x300',
			`markers=color:red%7Clabel:C%7C${station.latitude},${station.longitude}`,
			`key=${mapsApiKey}`
		];
		return `${baseUrl}?${params.join('&')}`;
	}

	return (<>
		<NavbarComponent />
		<main className="px-20">
			<div className="flex flex-wrap gap-5 items-center justify-between">
				<h1 className="text-3xl text-secondary font-bold py-5">Consultar Combustible Disponible</h1>
				<div className="mx-3 w-64">
					<Select onChange={(e) => setSelectedFuelType(e ?? "0")}
						className="text-white aria-expanded:border-secondary aria-expanded:border-t-transparent"
						label='Tipo de Combustible'
						labelProps={{
							className: "peer-aria-expanded:before:!border-secondary " +
								"peer-aria-expanded:after:!border-secondary peer-aria-expanded:!text-secondary"
						}}>
						{fuelTypes.map(fuel => (
							<Option key={fuel.id} value={fuel.id + ""} className="">
								{fuel.name}
							</Option>
						))}
					</Select>
				</div>
			</div>
			<div className="flex flex-wrap gap-5">
				{fuelStock.map(stock => (
					<div key={stock.station?.id} className="bg-primary border rounded-md p-5 shadow-md w-80">
						<Typography className="text-lg font-bold text-secondary">
							{stock.station?.name}
						</Typography>
						<a href={`https://www.google.com/maps?q=${stock.station?.latitude},${stock.station?.longitude}`}>
							<img src={generateMapUrl(stock.station!)} alt="Mapa"
								className="object-cover mb-2" />
						</a>
						<Typography className="text-md text-secondary font-bold">
							Stock Disponible: <span className='text-white font-normal'>{stock.quantity} lt</span>
						</Typography>
						<Typography className="text-md text-secondary font-bold">
							Precio: <span className='text-white font-normal'>{stock.price} Bs</span>
						</Typography>
					</div>
				))}
			</div>
		</main>
	</>)
}

export default HomePage
