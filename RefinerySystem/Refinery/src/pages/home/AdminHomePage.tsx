import NavbarComponent from '../../components/NavbarComponent'
import { Routes } from '../../routes/CONSTANTS'
import { ROLE_IDS } from '../../utilities/constants';

function AdminHomePage() {
	const userRole = Number(sessionStorage.getItem('userRole'));


	return (<>
		<NavbarComponent />
		<div className="text-center">
			<h1 className="text-3xl text-secondary font-bold py-5">
				Bienvenido
			</h1>
			<div className="flex flex-col m-auto w-96 gap-5">
				{userRole === ROLE_IDS.REFINERY_MANAGER && <a href={Routes.TRUCK.LIST}
					className="bg-secondary p-1 text-lg text-primary font-bold border-2 rounded-md">
					Administrar Camiones
				</a>}
				<a href={Routes.ROUTE.LIST} className="bg-secondary p-1 text-lg text-primary font-bold 
					border-2 rounded-md">Ver Rutas</a>
			</div>
		</div>
	</>)
}

export default AdminHomePage
