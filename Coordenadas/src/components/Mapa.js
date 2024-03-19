import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Image, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import i18n from '../languages/ii8n.js';

const Mapa = () => {
    const [coords, setCoords] = useState([]);
    const [bussola, setbussola] = useState(0);
    const [routeData, setRouteData] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mapType, setMapType] = useState('standard');
    const [speedCar, setSpeedCar] = useState(0); // Estado para controlar a velocidade do marcador 3
    const [spriteSpeed, setSpriteSpeed] = useState(10); // Estado para controlar a velocidade do marcador 3
    const [selectedCourseIndex, setSelectedCourseIndex] = useState(0); // Estado para armazenar qual coordenadas o usuario quer 
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const [showDestinationMessage, setShowDestinationMessage] = useState(false); 
    const spriteImage = require('../../assets/vehicles.png');
    const mapRef = useRef(null);

    const { t } = useTranslation();
    let rosadosventos = -380

    const handleRouteReady = (result) => {
        setRouteData(result); // Armazenar os dados da rota no estado
    };

    const handleCourseSelection = (index) => {
        setSelectedCourseIndex(index); // Atualiza o estado com o índice do curso selecionado
    };

    const toggleMapType = () => {
        setMapType(mapType === 'standard' ? 'satellite' : 'standard');
    };

    const startMovement = async () => {
        setShowDestinationMessage(false);
        if (selectedCourseIndex !== null) {
            setIsPlaying(true);
            setCurrentPositionIndex(0);
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
                direction: coord.direction,
            }));

            console.table(seedCarArray)

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

    const changeLanguage = () => {
        let newLanguage = '';
        switch (currentLanguage) {
            case 'pt':
                newLanguage = 'en';
                break;
            case 'en':
                newLanguage = 'es';
                break;
            case 'es':
                newLanguage = 'pt';
                break;
            default:
                newLanguage = 'pt';
        }

        i18n.changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage);
    };

    function watchPosition(direction) {
        let point = '';
        if (direction >= -15 && direction < 15) {
            rosadosventos = -380;
            point = 'norte';
        } else if (direction >= 15 && direction < 75) {
            rosadosventos = -510;
            point = 'nordeste';
        } else if (direction >= 75 && direction < 105) {
            rosadosventos = -640;
            point = 'leste';
        } else if (direction >= 105 && direction < 165) {
            rosadosventos = -760;
            point = 'sudeste';
        } else if (direction >= 165 && direction < 195) {
            rosadosventos = -880;
            point = 'sul';
        } else if (direction >= 255 && direction < 285) {
            rosadosventos = -140;
            point = 'oeste';
        } else if (direction >= 285 && direction < 345) {
            rosadosventos = -260;
            point = 'noroeste';
        } else {
            rosadosventos = -380;
            point = 'norte';
        }
        setbussola(rosadosventos)
        console.log("direction: " + direction + point + ": " + rosadosventos);

    }

    useEffect(() => {
        let timer;
        let newAnimetSpeed
        if (routeData && routeData.coordinates && routeData.coordinates.length > 0 && isPlaying) {
            let index = 0;
            const moveMarker = () => {
                let realTimeSpeedCar = 0; // Inicialize com 0
                let direction = 0; // Inicialize a direção com 0
                if (speedCar[index] && speedCar[index].speed !== undefined && speedCar[index].speed !== null && speedCar[index].speed !== 0) {
                    realTimeSpeedCar = speedCar[index].speed;
                    direction = speedCar[index].direction;
                } else {
                    // Gerar um novo número aleatório entre 70 e 100 a cada vez que não houver velocidade definida
                    realTimeSpeedCar = Math.floor(Math.random() * (70 - 10 + 1)) + 10;
                    direction = 0;
                }

                // Recalcular newAnimetSpeed com base no realTimeSpeedCar
                newAnimetSpeed = 1000 - realTimeSpeedCar * 10;
                setSpriteSpeed(parseFloat(realTimeSpeedCar).toFixed(2))

                if (direction !== undefined) {
                    rosadosventos = direction;
                    watchPosition(direction);
                } else {
                    console.error('Direção não definida');
                }

                index++;

                // Atualiza a posição do marcador apenas se não tiver atingido o final da rota
                if (index < routeData.coordinates.length) {
                    setCurrentPositionIndex(index);
                } else {
                    // Se chegarmos ao final da rota, limpe o timer
                    clearInterval(timer);
                    setShowDestinationMessage(true);
                }

   
            };

            // Chama moveMarker imediatamente para iniciar o movimento
            moveMarker();



            timer = setInterval(moveMarker, newAnimetSpeed); // Configura a  velociadade do carro com o valor que esta atribuido a  newAnimetSpeed
        }


        

        return () => clearInterval(timer);
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
                camera={{
                    heading: 300,
                    pitch: 0,
                    zoom: 15,
                }}
                mapType={mapType}
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
                        apikey={"google key"}
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
            {showDestinationMessage && (
                    <View style={styles.destinationMessageContainer}>
                        <Text style={styles.destinationMessage}>{t('common.destinationReached')}</Text>
                    </View>
                )}
            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.button} onPress={startMovement}>
                    <Icon name="play" size={30} color="#fff" />
                </TouchableOpacity>
                <View style={styles.speedControls}>
                    <Text style={styles.speedValue}>{spriteSpeed}</Text>
                    <Text style={styles.speedUnit}>{t('common.speedUnit')}</Text>
                </View>
                <TouchableOpacity style={styles.toggleButton} onPress={toggleMapType}>
                    <Text style={styles.toggleButtonText}>
                        {t(`common.mapTypeToggle.${mapType}`)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.languageButton} onPress={changeLanguage}>
                    <Text style={styles.languageButtonText}>{t('common.changeLanguage')}</Text>
                </TouchableOpacity>

                
            </View>

            <View style={styles.courseSelection}>
                {[0, 1, 2, 3, 4].map((index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.courseButton, selectedCourseIndex === index ? styles.selectedCourseButton : null]}
                        onPress={() => handleCourseSelection(index)}
                    >
                        <Text style={styles.courseButtonText}>{t('common.course')}  {index + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        flexDirection: 'column',
        paddingTop: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    sprite: {
        width: 60,
        height: 60,
    },
    controlsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 300,
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 20,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    speedControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    speedValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    speedUnit: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 5,
    },
    courseSelection: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 20,
    },
    courseButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedCourseButton: {
        backgroundColor: '#007bff',
    },
    courseButtonText: {
        color: 'black',
        fontSize: 16,
    },
    toggleButton: {

        marginTop: 10,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    languageButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    languageButtonText: {
        color: 'white',
        fontSize: 16,
    },
    destinationMessageContainer: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height:40,
        marginEnd:10,
        width:"auto"
    },
    destinationMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});


export default Mapa;
