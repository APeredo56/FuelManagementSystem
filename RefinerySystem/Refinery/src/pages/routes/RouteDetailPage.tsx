import { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { Route } from "../../models/objects/Route";
import { useParams } from "react-router-dom";
import { RechargeRequest } from '../../models/objects/RechargeRequest';
import { RouteService } from "../../services/api/RouteService";
import { RechargeRequestService } from "../../services/api/RechargeRequestService";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Typography } from "@material-tailwind/react";

const RouteDetailPage = () => {
    const { id } = useParams();
    const emptyRoute: Route = {
        id: 0,
        name: "",
        fuel_quantity: 0,
        fuel_price: 0,
    }
    const [route, setRoute] = useState<Route>(emptyRoute);
    const [routeStops, setRouteStops] = useState<RechargeRequest[]>([]);

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
        fetchRoute();
        fetchRouteStops();

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

    const fetchRoute = () => {
        RouteService.get(Number(id)).then(response => {
            setRoute(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    const fetchRouteStops = () => {
        RechargeRequestService.getByRoute(Number(id)).then(response => {
            setRouteStops(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (<>
        <NavbarComponent />
        <main className="px-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl text-secondary font-bold py-8 w-fit text-nowrap">Detalles de Ruta</h1>
            </div>
            <div className="grid grid-cols-2">
                <div className="w-96 bg-primary p-3 rounded-md border h-fit m-auto grid grid-cols-3 gap-5 
                    items-center">
                    <Typography className="text-secondary font-bold">Nombre</Typography>
                    <Typography className="text-secondary font-bold">Cantidad de Combustible</Typography>
                    <Typography className="text-secondary font-bold">Precio de Combustible</Typography>
                    <Typography>{route.name}</Typography>
                    <Typography>{route.fuel_quantity} L</Typography>
                    <Typography>${route.fuel_price}</Typography>
                    <div className="flex justify-center items-center col-span-3">
                        <span className="h-[25px] w-[25px] bg-[#ff0000] rounded-full me-3"></span>Pendiente
                    </div>
                    <div className="flex justify-center items-center col-span-3">
                        <span className="h-[25px] w-[25px] bg-[#0C2EE5] rounded-full me-3"></span>Completado
                    </div>
                </div>

                <div className="">
                    {mapLatitude !== "" && isLoaded && <div className="w-full h-[70vh] bg-red-500">
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
                            {routeStops.map(stop => (
                                <Marker key={stop.id} position={{
                                    lat: stop.station.latitude,
                                    lng: stop.station.longitude
                                }} label={stop.station.name + " - " + stop.fuel_quantity + " L"}
                                    options={{
                                        icon: {
                                            ...customMarkerIcon,
                                            anchor: new google.maps.Point(50, 80),
                                            fillColor: stop.completed ? "#0C2EE5" : "red",
                                        }
                                    }} />
                            ))}
                        </GoogleMap>
                    </div>}
                </div>
            </div>
        </main>
    </>);
}

export default RouteDetailPage;