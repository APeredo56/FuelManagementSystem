import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { useNavigate, useParams } from "react-router-dom";
import { StationService } from "../../services/StationService";
import { Routes } from "../../routes/CONSTANTS";
import { Station } from "../../models/objects/Station";
import { Input } from "@material-tailwind/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const StationFormPage = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [mapLatitude, setMapLatitude] = useState("");
    const [mapLongitude, setMapLongitude] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const mapsApiKey = import.meta.env.VITE_MAP_KEY;
    const { isLoaded: isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: mapsApiKey
    });

    const validate = (): boolean => {
        if (name === "") {
            setError('Ingrese un nombre');
            return false;
        } else if (latitude === "" || longitude === "") {
            setError('Seleccione una ubicación');
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (id) fetchStation();
        if (navigator.geolocation) {
            if (id) {
                return;
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
        } else {
            console.error('La geolocalización no es compatible con este navegador.');
        }
    }, []);

    const fetchStation = () => {
        StationService.get(Number(id)).then(response => {
            setName(response.name);
            setLatitude(response.latitude + "");
            setLongitude(response.longitude + "");
            setMapLatitude(response.latitude + "");
            setMapLongitude(response.longitude + "");
        }).catch((error) => {
            console.log(error);
        });
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        if (!id) {
            createStation();
        } else {
            updateStation();
        }
    }

    const createStation = () => {
        const newStation: Station = {
            name: name,
            latitude: Number(latitude),
            longitude: Number(longitude)
        }
        StationService.create(newStation)
            .then(() => navigate(Routes.STATION.LIST))
            .catch(() => setError('Error al crear el surtidor'));
    }

    const updateStation = () => {
        const newStation: Station = {
            id: Number(id),
            name: name,
            latitude: Number(latitude),
            longitude: Number(longitude)
        }
        StationService.update(newStation)
            .then(() => navigate(Routes.STATION.LIST))
            .catch(() => setError('Error al actualizar el surtidor'));
    }

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const { latLng } = event;
        const lat = latLng?.lat();
        const lng = latLng?.lng();
        setLatitude(lat + "");
        setLongitude(lng + "");
    };

    return (<>
        <NavbarComponent />
        <main className="flex flex-col items-center mb-5">
            <h1 className="text-3xl text-secondary font-bold py-5">{id ? "Editar" : "Crear"} Surtidor</h1>
            <form className="w-96 bg-primary p-3 rounded-md border" onSubmit={(e) => onFormSubmit(e)}>
                <Input className="text-white focus:border-secondary focus:border-t-transparent 
                        peer-focus:before:!border-secondary mb-3" name="name"
                    value={name} onChange={(e) => setName(e.target.value)}
                    type="text" crossOrigin={null} label="Nombre"
                    labelProps={{
                        className: "peer-focus:before:!border-secondary " +
                            "peer-focus:after:!border-secondary peer-focus:text-secondary",
                    }}
                    containerProps={{ className: "mb-3" }} />
                {mapLatitude !== "" && isLoaded && <div className="w-full h-[50vh]">
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
                        zoom={14}
                        onClick={handleMapClick}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                    >
                        {latitude !== "" &&
                            <Marker position={{ lat: Number(latitude), lng: Number(longitude) }} />}
                    </GoogleMap>
                </div>}
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

export default StationFormPage;