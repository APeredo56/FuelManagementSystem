import NavbarComponent from '../../components/NavbarComponent'
import { Routes } from '../../routes/CONSTANTS'

function HomePage() {

	return (<>
		<NavbarComponent />
		<div className="text-center">
			<h1 className="text-3xl text-secondary font-bold py-5">Administrar</h1>
			<div className="flex flex-col m-auto w-96 gap-5">
				<a href={Routes.USER.LIST} className="bg-secondary p-1 text-lg text-primary font-bold 
					border-2 rounded-md">Usuarios</a>
				<a href={Routes.STATION.LIST} className="bg-secondary p-1 text-lg text-primary font-bold 
					border-2 rounded-md">Surtidores</a>
			</div>
		</div>
	</>)
}

export default HomePage
