import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy } from 'expo-location';

const Mapa = () => {
    const [coords, setCoords] = useState([]);
    const [bussola, setbussola] = useState(0);
    const [routeData, setRouteData] = useState(null);
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const spriteImage = require('../../assets/vehicles.png');
    const mapRef = useRef(null);

    async function requestLocationPermissions() { // Pedir permissao de localizaçao GPS para o usuario
        const { granted } = await requestForegroundPermissionsAsync();
        if (granted) {
            const currentPosition = await getCurrentPositionAsync();
            setLocation(currentPosition);
        }
    }

    useEffect(() => {
        requestLocationPermissions();
        watchPositionAsync({
            accuracy: LocationAccuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1
        }, (response) => {
            const { coords } = response;
            // Calcular a direção do movimento
            const angle = coords.heading !== null ? coords.heading : 0;
            console.log("angle: " + angle)
            // Calcular a direção do movimento
            let point = '';
            if (angle >= -15 && angle < 15) {
                setbussola(-380);
                point = 'norte';
            } else if (angle >= 15 && angle < 75) {
                setbussola(-510);
                point = 'nordeste';
            } else if (angle >= 75 && angle < 105) {
                setbussola(-640);
                point = 'leste';
            } else if (angle >= 105 && angle < 165) {
                setbussola(-760);
                point = 'sudeste';
            } else if (angle >= 165 && angle < 195) {
                setbussola(-880);
                point = 'sul';
            } else if (angle >= 255 && angle < 285) {
                setbussola(-140);
                point = 'oeste';
            } else if (angle >= 285 && angle < 345) {
                setbussola(-260);
                point = 'noroeste';
            } else {
                setbussola(-380);
                point = 'norte';
            }
            console.log(point);
            console.log(bussola);
        });
    }, []);

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                const data = require('./frontend_data_gps.json');
                const course = data.courses[0]; // Acessar o primeiro curso
                const { gps } = course;

                // Coordenadas do primeiro objeto
                const firstGPS = gps[0];
                const firstCoordinates = {
                    latitude: firstGPS.latitude,
                    longitude: firstGPS.longitude
                };

                // Coordenadas do último objeto
                const lastGPS = gps[gps.length - 1];
                const lastCoordinates = {
                    latitude: lastGPS.latitude,
                    longitude: lastGPS.longitude
                };

                // Criar um array com as coordenadas do primeiro e último objeto
                const formattedCoordinates = [firstCoordinates, lastCoordinates];

                setCoords(formattedCoordinates); // Definir os dados do estado com o novo array de coordenadas
            } catch (error) {
                console.error('Erro ao carregar as coordenadas:', error);
            }
        };

        fetchCoords();
    }, []);

    useEffect(() => {
        if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
            const timer = setInterval(() => {
                setCurrentPositionIndex(index => {
                    const nextIndex = index + 1;
                    if (nextIndex >= routeData.coordinates.length) {
                        clearInterval(timer);
                    }
                    return nextIndex;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [routeData]);

    useEffect(() => {

    })

    useEffect(() => {
        if (mapRef.current && routeData && routeData.coordinates && routeData.coordinates.length > 0) {
            const { latitude, longitude } = routeData.coordinates[currentPositionIndex];
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
    }, [currentPositionIndex, routeData]);

    const handleRouteReady = (result) => {
        setRouteData(result); // Armazenar os dados da rota no estado
    };


    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: -23.9632,
                    longitude: -46.2805,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {coords.map((coord, index) => (
                    <Marker
                        key={index}
                        coordinate={coord}
                        title={`Ponto ${index + 1}`}
                    />
                ))}
                {/* Traçar rota */}
                {coords.length >= 2 && (
                    <MapViewDirections
                        origin={coords[0]} // Primeiro ponto
                        destination={coords[coords.length - 1]} // Último ponto
                        waypoints={coords.slice(1, -1)} // Pontos intermediários
                        strokeWidth={3}
                        strokeColor="red"
                        apikey={"Coloca aqui sua chave da api do google!!"}
                        onReady={handleRouteReady}
                    />
                )}
                {/* Adicionar um terceiro marcador */}
                {routeData && routeData.coordinates && routeData.coordinates.length > 0 && (
                    <Marker.Animated
                        coordinate={routeData.coordinates[currentPositionIndex]} // Define a primeira coordenada da rota como a posição do terceiro marcador
                        title="Terceiro Ponto"
                        pinColor="blue"
                        style={{ width: 100, height: 100 }}
                    >
                        <Image source={spriteImage} style={[styles.sprite, { left: 1 * bussola, width: 1000, height: 1000 }]} />
                    </Marker.Animated>
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    sprite: {
        width: 60, // Largura da imagem
        height: 60, // Altura da imagem
    },
});

export default Mapa;
