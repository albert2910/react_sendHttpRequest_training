import Places from './Places.jsx';
import {useEffect, useState} from "react";
import Error from "./Error.jsx";
import {sortPlacesByDistance} from "../loc.js";
import {fetchAvailablePlaces} from "../http.js";

export default function AvailablePlaces({onSelectPlace}) {
    const [isFetching, setIsFetching] = useState(false);
    const [availablePlaces, setAvailablePlaces] = useState([]);
    const [error, setError] = useState();

    // use Promise
    // useEffect(() => {
    //     fetch('http://localhost:3000/places')
    //         .then((response) => {
    //             return response.json();
    //         }).then((resData) => {
    //         setAvailablePlaces(resData.places);
    //     });
    // }, []);

    // use async/ await
    useEffect(() => {
        async function fetchPlaces() {
            setIsFetching(true);

            try {
                const places = await fetchAvailablePlaces();
                // const response = await fetch('http://localhost:3000/places');
                // const resData = await response.json();
                //
                // if (!response.ok) {
                //     throw new Error('Failed to fetch places');
                // }

                // sap xep theo vi tri nguoi dung gan nhat
                navigator.geolocation.getCurrentPosition((position) => {
                    const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
                    setAvailablePlaces(sortedPlaces);
                    setIsFetching(false);
                })

            } catch (err) {
                setError({message: err.message || 'Could not fetch places, please try later.'});
                setIsFetching(false);
            }
        }
        fetchPlaces();
    }, []);

    if(error) {
        return <Error title="An error occurred!" message={error.message}/>
    }

    return (
        <Places
            title="Available Places"
            places={availablePlaces}
            isLoading={isFetching}
            loadingText="Fetching place data..."
            fallbackText="No places available."
            onSelectPlace={onSelectPlace}
        />
    );
}
