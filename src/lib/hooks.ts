import { useState } from "react";

export const useUserCoords = () => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }

    if (latitude != 0 && longitude != 0) {
        return {
            lat: latitude,
            long: longitude,
        };
    }
    return null;
};
