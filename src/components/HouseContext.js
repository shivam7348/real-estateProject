import React, { useState, useEffect, createContext } from 'react';
import { housesData } from "../data";

export const HouseContext = createContext();

const HouseContextProvider = ({ children }) => {
    const [houses, setHouses] = useState(housesData);
    const [country, setCountry] = useState("Location (any)");
    const [countries, setCountries] = useState([]);
    const [property, setProperty] = useState('Property (any)');
    const [properties, setProperties] = useState([]);
    const [price, setPrice] = useState('Price range (any)');
    const [startDate, setStartDate] = useState('Rent Date (any)');
    const [loading, setLoading] = useState(false);

    // Fetch countries and properties
    useEffect(() => {
        const uniqueCountries = ['Location (any)', ...new Set(houses.map(house => house.country))];
        setCountries(uniqueCountries);
    }, [houses]);

    useEffect(() => {
        const uniqueProperties = ['Property (any)', ...new Set(houses.map(house => house.type))];
        setProperties(uniqueProperties);
    }, [houses]);

    const handleClick = () => {
        setLoading(true);

        const isDefault = (str) => str.includes('(any)');
        const minPrice = parseInt(price.split(' ')[0].replace(/\D/g, ''));
        const maxPrice = parseInt(price.split(' ')[2].replace(/\D/g, ''));
        const dateSelected = new Date(startDate).getTime();

        const newHouses = housesData.filter((house) => {
            const housePrice = parseInt(house.price.replace(/\D/g, ''));
            const houseAvailableDate = new Date(house.date).getTime();

            return (
                (isDefault(country) || house.country === country) &&
                (isDefault(property) || house.type === property) &&
                (isDefault(price) || (housePrice >= minPrice && housePrice <= maxPrice)) &&
                (isDefault(startDate) || houseAvailableDate >= dateSelected)
            );
        });

        setTimeout(() => {
            if (newHouses.length < 1) {
                setHouses([]);
            } else {
                setHouses(newHouses);
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <HouseContext.Provider value={{
            country, setCountry, countries,
            property, setProperty, properties,
            price, setPrice, startDate, setStartDate,
            houses, loading, handleClick,
        }}>
            {loading ? <div>Loading...</div> : children}
        </HouseContext.Provider>
    );
};

export default HouseContextProvider;
