import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy } from 'expo-location';

const Mapa = () => {
    const [coords, setCoords] = useState([]);
    const [bussola, setbussola] = useState(0);
    const [routeData, setRouteData] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedCar, setSpeedCar] = useState(0); // Estado para controlar a velocidade do marcador 3
    const [spriteSpeed, setSpriteSpeed] = useState(10); // Estado para controlar a velocidade do marcador 3
    const [selectedCourseIndex, setSelectedCourseIndex] = useState(0); // Estado para armazenar qual coordenadas o usuario quer 
    
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
    const startMovement = async () => {
        if (selectedCourseIndex !== null) {
            setIsPlaying(true);
            setCurrentPositionIndex(0);
            await watchPositionAsync({
                accuracy: LocationAccuracy.Highest,
                timeInterval: 1000,
                distanceInterval: 1
            }, (response) => {
                const { coords } = response;
                const angle = coords.heading !== null ? coords.heading : 0;
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
            });
            const data = require('./frontend_data_gps.json');
            const course = data.courses[selectedCourseIndex];
            const { gps } = course;
            const firstGPS = gps[0];
            const firstCoordinates = {
                latitude: firstGPS.latitude,
                longitude: firstGPS.longitude,
            };
            const seedCarArray = gps.map(coord => ({
                speed: coord.speed,
            }));
            setSpeedCar(seedCarArray)
            const lastGPS = gps[gps.length - 1];
            const lastCoordinates = {
                latitude: lastGPS.latitude,
                longitude: lastGPS.longitude
            };
            const formattedCoordinates = [firstCoordinates, lastCoordinates];
            setCoords(formattedCoordinates);
            const result = {
                coordinates: formattedCoordinates,
                distance: 0,
                duration: 0,
            };
            setRouteData(result);
        }
    };


    // useEffect(() => {
    //     requestLocationPermissions();
    //     watchPositionAsync({
    //         accuracy: LocationAccuracy.Highest,
    //         timeInterval: 1000,
    //         distanceInterval: 1
    //     }, (response) => {
    //         const { coords } = response;
    //         // Calcular a direção do movimento
    //         //console.log(coords)
    //         const angle = coords.heading !== null ? coords.heading : 0;
    //         // console.log("angle: " + angle)
    //         // Calcular a direção do movimento
    //         let point = '';
    //         if (angle >= -15 && angle < 15) {
    //             setbussola(-380);
    //             point = 'norte';
    //         } else if (angle >= 15 && angle < 75) {
    //             setbussola(-510);
    //             point = 'nordeste';
    //         } else if (angle >= 75 && angle < 105) {
    //             setbussola(-640);
    //             point = 'leste';
    //         } else if (angle >= 105 && angle < 165) {
    //             setbussola(-760);
    //             point = 'sudeste';
    //         } else if (angle >= 165 && angle < 195) {
    //             setbussola(-880);
    //             point = 'sul';
    //         } else if (angle >= 255 && angle < 285) {
    //             setbussola(-140);
    //             point = 'oeste';
    //         } else if (angle >= 285 && angle < 345) {
    //             setbussola(-260);
    //             point = 'noroeste';
    //         } else {
    //             setbussola(-380);
    //             point = 'norte';
    //         }
    //         //console.log(point);
    //         //console.log(bussola);
    //     });
    // }, []);

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                const data = require('./frontend_data_gps.json');
                const course = data.courses[selectedCourseIndex];
                const { gps } = course;
                console.log(selectedCourseIndex)
                // Coordenadas do primeiro objeto
                const firstGPS = gps[0];
                const firstCoordinates = {
                    latitude: firstGPS.latitude,
                    longitude: firstGPS.longitude,
                };

                const seedCarArray = gps.map(coord => ({
                    speed: coord.speed, // Adicionar a velocidade à coordenada
                }));
                setSpeedCar(seedCarArray)

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
        let timer; // Declare a variável do timer aqui
        
        if (routeData && routeData.coordinates && routeData.coordinates.length > 0 && isPlaying) {
            let index = 0; // Inicializa o índice da posição atual
    
            const moveMarker = () => {
                let realTimeSpeedCar = 0; // Inicialize com 0
    
                if (speedCar[index] && speedCar[index].speed !== undefined && speedCar[index].speed !== null && speedCar[index].speed !== 0) {
                    realTimeSpeedCar = speedCar[index].speed;
                } else {
                    // Gerar um novo número aleatório entre 40 e 100 a cada vez que não houver velocidade definida
                    realTimeSpeedCar = Math.floor(Math.random() * (70 - 10 + 1)) + 10;
                }
    
                // Recalcular newAnimetSpeed com base no realTimeSpeedCar
                const newAnimetSpeed = 1000 - realTimeSpeedCar * 10;
                setSpriteSpeed(parseFloat(realTimeSpeedCar).toFixed(2))
                console.log("realTimeSpeedCar FELLIPE:", realTimeSpeedCar, "animetSpeed:", newAnimetSpeed);
    
                // Avança para a próxima posição
                index++;
    
                // Atualiza a posição do marcador apenas se não tiver atingido o final da rota
                if (index < routeData.coordinates.length) {
                    setCurrentPositionIndex(index);
                } else {
                    // Se chegarmos ao final da rota, limpe o timer
                    clearInterval(timer);
                }
            };
    
            // Chama moveMarker imediatamente para iniciar o movimento
            moveMarker();
    
            // Configura o timer para chamar moveMarker com base no novo intervalo a cada iteração
            timer = setInterval(moveMarker, 1000);
        }
    
        return () => clearInterval(timer); // Limpeza do timer no desmontagem do componente
    }, [routeData, isPlaying, speedCar]);
    

    useEffect(() => {
        if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
            if (currentPositionIndex < routeData.coordinates.length - 1 && mapRef.current && routeData && routeData.coordinates && routeData.coordinates.length > 0) {
                const { latitude, longitude } = routeData.coordinates[currentPositionIndex];
                mapRef.current.animateToRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            }
        }
    }, [currentPositionIndex, routeData]);

    const handleRouteReady = (result) => {
        setRouteData(result); // Armazenar os dados da rota no estado
    };

    const handleCourseSelection = (index) => {
        setSelectedCourseIndex(index); // Atualiza o estado com o índice do curso selecionado
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
                {coords.length >= 2 && (
                    <MapViewDirections
                        origin={coords[0]}
                        destination={coords[coords.length - 1]}
                        waypoints={coords.slice(1, -1)}
                        strokeWidth={3}
                        strokeColor="red"
                        apikey={"Coloca aqui sua chave da api do google!!"}
                        onReady={handleRouteReady}
                    />
                )}
                {routeData && routeData.coordinates && routeData.coordinates.length > 0 && (
                    <Marker.Animated
                        coordinate={routeData.coordinates[currentPositionIndex]}
                        title="Terceiro Ponto"
                        pinColor="blue"
                        style={{ width: 100, height: 100 }}
                    >
                        <Image source={spriteImage} style={[styles.sprite, { left: 1 * bussola, width: 1000, height: 1000 }]} />
                    </Marker.Animated>
                )}
            </MapView>
            <TouchableOpacity style={styles.button} onPress={startMovement}>
                <Text style={styles.buttonText}>PLAY</Text>
            </TouchableOpacity>
            <View style={styles.speedControls}>
                <Text style={styles.speedValue}>{spriteSpeed} KM/h</Text>  
            </View>
            <View style={styles.courseSelection}>
                {[0, 1, 2, 3, 4].map((index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.courseButton, selectedCourseIndex === index ? styles.selectedCourseButton : null]}
                        onPress={() => handleCourseSelection(index)}
                    >
                        <Text style={styles.courseButtonText}>Trajeto  {index + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>
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
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    speedControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    speedButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    speedButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    courseSelection: {
        flexDirection: 'row',
        marginTop: 10,
    },
    courseButton: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginRight: 10,
    },
    selectedCourseButton: {
        backgroundColor: 'blue',
    },
    courseButtonText: {
        color: 'black',
        fontSize: 16,
    },
});

export default Mapa;
