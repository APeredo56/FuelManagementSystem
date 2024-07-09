import { Menu, MenuHandler, MenuItem, MenuList, Navbar, Typography } from "@material-tailwind/react";
import { Routes } from "../routes/CONSTANTS";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_IDS } from "../utilities/constants";

const NavbarComponent = () => {
	const [name, setName] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!sessionStorage.getItem('access_token') && window.location.pathname !== Routes.LOGIN) {
			window.location.href = Routes.LOGIN;
			return;
		}
		const userRole = Number(sessionStorage.getItem('userRole')??0);
		if (userRole !== ROLE_IDS.STATION_MANAGER && userRole !== ROLE_IDS.SALESPERSON) {
			sessionStorage.clear();
			navigate(Routes.LOGIN);
		}
		setName(sessionStorage.getItem('userName') ?? '');
	}, []);

	const logout = () => {
		sessionStorage.clear();
		navigate(Routes.LOGIN);
	}

	return (
		<Navbar className="bg-primary sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-0 border-b-2 border-secondary ">
			<div className="flex items-center justify-between">
				<Typography
					as="a"
					href={Routes.HOME}
					className="mr-4 cursor-pointer py-1.5 font-medium text-lg lg:text-xl text-secondary"
				>
					Sistema de Ventas
				</Typography>
				<div className="flex items-center gap-4">
					<div className="mr-4 hidden lg:block"></div>
					<div className="flex items-center gap-x-1">
						{name !== '' && <Menu>
							<MenuHandler>
								<Typography className="cursor-pointer flex items-center text-secondary">
									{`${name}`}
									<svg width="6" height="3" className="ml-2 overflow-visible" aria-hidden="true"><path d="M0 0L3 3L6 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path></svg>
								</Typography>
							</MenuHandler>
							<MenuList className="bg-primary">
								{/* <a href={Routes.HOME}>
									<MenuItem>
										<Typography
											className="hidden lg:inline-block text-white"
										>
											Mis Rifas
										</Typography>
									</MenuItem>
								</a> */}
								<MenuItem onClick={() => logout()}>
									<Typography
										className="hidden lg:inline-block text-white"
									>
										Cerrar Sesión
									</Typography>
								</MenuItem>
							</MenuList>
						</Menu>}
					</div>
				</div>
			</div>
		</Navbar>
	);
}

export default NavbarComponent;