import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";

type Props = {
    isOpen: boolean,
    handleClose: () => void,
    message: string,
}

const AlertModal = ({isOpen, handleClose, message}: Props) => {
    return (<Dialog size='xs' open={isOpen} handler={handleClose} className="bg-primary border">
        <DialogHeader className="text-secondary border-0 border-b">Alerta</DialogHeader>
        <DialogBody className="text-white">
            {message}
        </DialogBody>
        <DialogFooter className="border-0 border-t">
            <Button onClick={handleClose} className="mr-1 bg-secondary">
                Confirmar
            </Button>
        </DialogFooter>
    </Dialog>);
}

export default AlertModal;