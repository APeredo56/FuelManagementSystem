import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { RechargeRequest } from "../../models/objects/RechargeRequest";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";

type Props = {
    isOpen: boolean,
    onClose: () => void,
    rechargeRequests: RechargeRequest[],
    handleRequestClick: (request: RechargeRequest) => void,
    selectedRequests: RechargeRequest[],
    error: string,
}

const SelectStopsModal = ({ isOpen, onClose, rechargeRequests, handleRequestClick, selectedRequests,
    error
}: Props) => {
    const [mapLatitude, setMapLatitude] = useState("");
    const [mapLongitude, setMapLongitude] = useState("");
    const mapsApiKey = import.meta.env.VITE_MAP_KEY;
    const { isLoaded: isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: mapsApiKey
    });

    const customMarkerIcon = {
        path: "M50,10.417c-15.581,0-28.201,12.627-28.201,28.201c0,6.327,2.083,12.168,5.602,16.873L45." +
            "49,86.823c0.105,0.202,0.21,0.403,0.339,0.588l0.04,0.069l0.011-0.006c0.924,1.278,2.411,2." +
            "111,4.135,2.111c1.556,0,2.912-0.708,3.845-1.799l0.047,0.027l0.179-0.31c0.264-0.356,0.498" +
            "-0.736,0.667-1.155L72.475,55.65c3.592-4.733,5.726-10.632,5.726-17.032C78.201,23.044,65." +
            "581,10.417,50,10.417z M49.721,52.915c-7.677,0-13.895-6.221-13.895-13.895c0-7.673,6.218-13." +
            "895,13.895-13.895s13.895,6.222,13.895,13.895C63.616,46.693,57.398,52.915,49.721,52.915z",
        fillOpacity: 1,
        scale: 0.5,
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('La geolocalización no es compatible con este navegador.');
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMapLatitude(position.coords.latitude + "");
                setMapLongitude(position.coords.longitude + "");
            },
            (error) => {
                console.error(`Error al obtener la ubicación: ${error.message}`);
            }
        );
    }, []);

    const getLabelText = (request: RechargeRequest) => {
        if (selectedRequests.includes(request)) {
            return selectedRequests.indexOf(request) + 1 + " - " + request.fuel_quantity + " L";
        }
        return request.fuel_quantity + " L";
    }

    return (<Dialog open={isOpen} handler={onClose} className="bg-primary border">
        <DialogHeader className="text-secondary border-0 border-b">Seleccionar Paradas</DialogHeader>
        <DialogBody className="text-white">
            <p className="block text-md font-medium text-red-600 mb-1">
                {error}
            </p>
            {mapLatitude !== "" && isLoaded && <div className="w-full h-[70vh]">
                <GoogleMap
                    center={{
                        lat: parseFloat(mapLatitude),
                        lng: parseFloat(mapLongitude)
                    }}
                    options={{
                        zoomControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                    zoom={11}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                >
                    {rechargeRequests.map(request => (
                        <MarkerF key={request.id} position={{
                            lat: request.station.latitude,
                            lng: request.station.longitude
                        }}
                            label={{ text: getLabelText(request), className: 'font-bold' }}
                            options={{
                                icon: {
                                    ...customMarkerIcon,
                                    anchor: new google.maps.Point(50, 80),
                                    fillColor: selectedRequests.includes(request) ? "#0C2EE5" : "#4B4A49",
                                }
                            }}
                            onClick={() => {
                                handleRequestClick(request)
                            }} />
                    ))}
                </GoogleMap>
            </div>}
        </DialogBody>
        <DialogFooter className="border-0 border-t">
            <Button onClick={onClose} className="mr-1 bg-secondary">
                Confirmar
            </Button>
        </DialogFooter>
    </Dialog>);
}

export default SelectStopsModal;