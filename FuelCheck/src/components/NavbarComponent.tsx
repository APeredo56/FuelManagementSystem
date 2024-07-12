import { Navbar, Typography } from "@material-tailwind/react";
import { Routes } from "../routes/CONSTANTS";

const NavbarComponent = () => {

	return (
		<Navbar className="bg-primary sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-0 border-b-2 border-secondary ">
			<div className="flex items-center justify-between">
				<Typography as="a" href={Routes.HOME}
					className="mr-4 cursor-pointer py-1.5 font-medium text-lg lg:text-xl text-secondary"
				>
					Consulta de Combustible
				</Typography>
			</div>
		</Navbar>
	);
}

export default NavbarComponent;