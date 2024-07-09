import { useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent'
import { FuelType } from '../../models/FuelType'
import { FuelStock } from '../../models/FuelStock';

function HomePage() {
	const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
	const [fuelStock, setFuelStock] = useState<FuelStock[]>([]);

	return (<>
		<NavbarComponent />
		<div className="text-center">
			<h1 className="text-3xl text-secondary font-bold py-5">Consultar Combustible Disponible</h1>
			<div className="flex flex-col m-auto w-96 gap-5">
				
			</div>
		</div>
	</>)
}

export default HomePage
