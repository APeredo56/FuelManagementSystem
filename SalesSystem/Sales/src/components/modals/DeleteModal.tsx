import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";

type Props = {
    isOpen: boolean,
    handleOpen: () => void,
    onConfirm: () => void,
    title: string,
    message: string
}

const DeleteModal = ({ isOpen, handleOpen, onConfirm, title, message } : Props) => {
    return (<Dialog open={isOpen} handler={handleOpen} className="bg-dark-blue border">
            <DialogHeader className="text-white border-0 border-b">{title}</DialogHeader>
            <DialogBody className="text-white">
                {message}
            </DialogBody>
            <DialogFooter className="border-0 border-t">
                <Button variant="gradient" color="red" onClick={handleOpen} className="mr-1">
                    <span>Cancelar</span>
                </Button>
                <Button variant="gradient" color="green" onClick={onConfirm}>
                    <span>Confirmar</span>
                </Button>
            </DialogFooter>
        </Dialog>);
}

export default DeleteModal;