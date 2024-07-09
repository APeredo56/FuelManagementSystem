import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes/CONSTANTS";
import NavbarComponent from "../../components/NavbarComponent";
import { AuthService } from '../../services/api/AuthService';
import { ROLE_IDS } from "../../utilities/constants";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        AuthService.login({ username: email, password })
            .then((response) => {
                sessionStorage.setItem('access_token', response.access);
                sessionStorage.setItem('refresh_token', response.refresh);
                fetchUserInfo();
            }).catch(() => {
                setError("Credenciales incorrectas");
            });
    }

    const fetchUserInfo = () => {
        AuthService.me().then(response => {
            if (response.role !== ROLE_IDS.STATION_MANAGER && response.role !== ROLE_IDS.SALESPERSON) {
                setError("No tienes permisos para acceder a esta aplicación");
                return;
            }
            sessionStorage.setItem('userName', response.first_name);
            sessionStorage.setItem('userRole', response.role.toString());
            sessionStorage.setItem('userStationId', response.station?.id?.toString() ?? "0");
            navigate(Routes.HOME);
        });
    }

    return (<>
        <NavbarComponent />
        <main className="flex flex-col items-center">
            <h1 className="text-3xl text-secondary font-bold py-5">Iniciar Sesión</h1>
            <form className="w-96 bg-primary p-3 rounded-md border" onSubmit={(e) => onFormSubmit(e)}>
                <div className="mb-3">
                    <label htmlFor="email" className="block text-md font-medium mb-1">
                        Correo Electrónico
                    </label>
                    <input type="email" name="email" id="email" className="block flex-1 border w-full rounded-md
                            bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:outline-none 
                            sm:text-sm sm:leading-6 focus:border-secondary focus:ring-secondary focus:ring-1
                            "
                        placeholder="Ingresa tu correo electrónico" value={email} required
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Password" className="block text-md font-medium mb-1">
                        Contraseña
                    </label>
                    <input type="password" name="Password" id="Password" className="block flex-1 border w-full rounded-md
                            bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:outline-none 
                            sm:text-sm sm:leading-6 focus:border-secondary focus:ring-secondary focus:ring-1" required
                        placeholder="Ingresa tu contraseña" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <p className="block text-md font-medium text-red-600 mb-1">
                        {error}
                    </p>
                </div>
                <div className="text-center">
                    <button className="bg-secondary rounded-md border p-1" type="submit">
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </main>
    </>);
}

export default LoginPage;