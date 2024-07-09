import { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { useNavigate, useParams } from "react-router-dom";
import { UserService } from "../../services/UserService";
import { Routes } from "../../routes/CONSTANTS";
import { Role } from "../../models/objects/Role";
import { Station } from "../../models/objects/Station";
import { Input, Typography } from "@material-tailwind/react";
import { changeInput } from "../../utilities/FormUtils";
import { User } from "../../models/objects/User";
import { StationService } from "../../services/StationService";

const UserFormPage = () => {
    const { id } = useParams();
    const [error, setError] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [stations, setStations] = useState<Station[]>([]);
    const navigate = useNavigate();

    type Inputs = {
        name: string,
        lastName: string,
        email: string,
        phone: string,
        password: string,
        role: number,
        station: number
    }

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: 0,
        station: 0
    });

    const validate = (newInputs: Inputs): Errors => {
        const newErrors: Errors = {}
        if (!newInputs.name) newErrors.name = true
        if (!newInputs.lastName) newErrors.lastName = true
        if (!newInputs.email) newErrors.email = true
        if (!newInputs.phone) newErrors.phone = true
        if (!newInputs.password && !id) newErrors.password = true
        if (newInputs.role === 0) {
            newErrors.role = true
            setError('Seleccione al menos un rol');
        }

        return newErrors
    }

    type Errors = Partial<Record<keyof Inputs, boolean>>
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (id) fetchUser();
        fetchRoles();
        fetchStations();
    }, []);

    const fetchUser = () => {
        UserService.get(Number(id)).then(response => {
            setInputs({
                name: response.first_name,
                lastName: response.last_name,
                email: response.email,
                phone: response.phone,
                password: "",
                role: response.role,
                station: response.station?.id ?? 0
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const fetchRoles = () => {
        UserService.roleList().then(response => setRoles(response));
    }

    const fetchStations = () => {
        StationService.list().then(response => setStations(response));
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const validatedErrors = validate(inputs);
        setErrors(validatedErrors);
        const isValid = Object.keys(validatedErrors).length === 0;

        if (!isValid) {
            return;
        }
        if (!id) {
            createUser();
        } else {
            updateUser();
        }
    }

    const createUser = () => {
        const newUser: User = {
            first_name: inputs.name,
            last_name: inputs.lastName,
            email: inputs.email,
            phone: inputs.phone,
            password: inputs.password,
            role: inputs.role,
            station_id: inputs.station != 0 ? inputs.station : undefined,
            username: inputs.email
        };
        UserService.create(newUser)
            .then(() => navigate(Routes.USER.LIST))
            .catch(() => setError('Error al crear el usuario'));
    }

    const updateUser = () => {
        const newUser: User = {
            id: Number(id),
            first_name: inputs.name,
            last_name: inputs.lastName,
            email: inputs.email,
            phone: inputs.phone,
            role: inputs.role,
            station_id: inputs.station != 0 ? inputs.station : undefined,
            username: inputs.email
        };
        UserService.update(newUser)
            .then(() => navigate(Routes.USER.LIST))
            .catch(() => setError('Error al actualizar el usuario'));
    }

    return (<>
        <NavbarComponent />
        <main className="flex flex-col items-center mb-5">
            <h1 className="text-3xl text-secondary font-bold py-5">{id ? "Editar" : "Crear"} Usuario</h1>
            <form className="w-96 bg-primary p-3 rounded-md border" onSubmit={(e) => onFormSubmit(e)}>
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="name"
                    value={inputs.name} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="text" crossOrigin={null} error={errors.name} label="Nombre"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="lastName"
                    value={inputs.lastName} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="text" crossOrigin={null} error={errors.lastName} label="Apellido"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="email"
                    value={inputs.email} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="email" crossOrigin={null} error={errors.email} label="Correo"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="phone"
                    value={inputs.phone} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="number" crossOrigin={null} error={errors.phone} label="Teléfono"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                {!id && <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="password"
                    value={inputs.password} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="password" crossOrigin={null} error={errors.password} label="Contraseña"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />}
                <div className="mb-3">
                    <Typography className="text-secondary">Rol</Typography>
                    <select value={inputs.role} onChange={(e) => setInputs(prevInputs => ({
                        ...prevInputs,
                        role: Number(e.target.value)
                    }))} className="w-full p-2.5 bg-primary border border-blue-gray-200 rounded-md
                        focus:border-secondary focus:border-2">
                        <option value={0}>Seleccione un Rol</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id} className="">
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <Typography className="text-secondary">Surtidor</Typography>
                    <select value={inputs.station} onChange={(e) => setInputs(prevInputs => ({
                        ...prevInputs,
                        station: Number(e.target.value)
                    }))} className="w-full p-2.5 bg-primary border border-blue-gray-200 rounded-md
                        focus:border-secondary focus:border-2">
                        <option value={0}>Sin Surtidor</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id} className="">
                                {station.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <p className="block text-md font-medium text-red-600 mb-1">
                        {error}
                    </p>
                    <button type="submit" className="w-full bg-secondary text-white py-2.5 rounded-md">
                        Guardar
                    </button>
                </div>
            </form>
        </main>
    </>);
}

export default UserFormPage;