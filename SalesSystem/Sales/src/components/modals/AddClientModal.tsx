import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { ClientService } from "../../services/api/ClientService";
import { Client } from "../../models/objects/Client";
import { useEffect, useState } from "react";
import { changeInput } from "../../utilities/FormUtils";

type Props = {
    isOpen: boolean,
    handleOpen: () => void,
}

const AddClientModal = ({ isOpen, handleOpen }: Props) => {
    const [error, setError] = useState("");

    type Inputs = {
        name: string,
        lastName: string,
        email: string,
        phone: string,
    }

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const validate = (newInputs: Inputs): Errors => {
        const newErrors: Errors = {}
        if (!newInputs.name) newErrors.name = true
        if (!newInputs.lastName) newErrors.lastName = true
        if (!newInputs.email) newErrors.email = true
        if (!newInputs.phone) newErrors.phone = true

        return newErrors
    }

    type Errors = Partial<Record<keyof Inputs, boolean>>
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        setInputs({
            name: "",
            lastName: "",
            email: "",
            phone: "",
        });
        setErrors({});
    }, [isOpen]);

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const validatedErrors = validate(inputs);
        setErrors(validatedErrors);
        const isValid = Object.keys(validatedErrors).length === 0;

        if (!isValid) {
            return;
        }
        createClient();
    }

    const createClient = () => {
        const newClient: Client = {
            name: inputs.name,
            last_name: inputs.lastName,
            email: inputs.email,
            phone: inputs.phone,
        }
        ClientService.create(newClient).then(() => {
            handleOpen();
        }).catch(() => {
            setError("Ocurrio un error al crear el Cliente");
        });
    }

    return (<Dialog open={isOpen} handler={handleOpen} className="bg-primary border"
        dismiss={{ outsidePress: false }}>
        <form onSubmit={(e) => onFormSubmit(e)}>
            <DialogHeader className="text-secondary border-0 border-b">Agregar Cliente</DialogHeader>
            <DialogBody className="text-white">
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="name"
                    value={inputs.name} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="text" crossOrigin={null} label="Nombre" error={errors.name}
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="lastName"
                    value={inputs.lastName} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="text" crossOrigin={null} label="Apellido" error={errors.lastName}
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="email"
                    value={inputs.email} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="email" crossOrigin={null} label="Correo Electrónico" error={errors.email}
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="phone"
                    value={inputs.phone} onChange={(e) => changeInput(e, setInputs, setErrors)}
                    type="number" crossOrigin={null} label="Teléfono" error={errors.phone}
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                <div className="mb-3">
                    <p className="block text-md font-medium text-red-600 mb-1">
                        {error}
                    </p>
                </div>
            </DialogBody>
            <DialogFooter className="border-0 border-t">
                <Button variant="gradient" color="red" type="button" onClick={handleOpen} className="mr-1">
                    <span>Cancelar</span>
                </Button>
                <Button className="bg-secondary" type="submit">
                    <span>Confirmar</span>
                </Button>
            </DialogFooter>
        </form>
    </Dialog>);
}

export default AddClientModal;