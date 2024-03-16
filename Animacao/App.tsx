import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy } from 'expo-location';
import { styles } from './syles';

type CustomMarkerType = {
  animateMarkerToCoordinate: (coord: LatLng) => void;
}

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [carImage, setCarImage] = useState<JSX.Element | null>(null);
  const spriteImage = require('./assets/vehicles.png');
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<CustomMarkerType | null>(null);

  const [latitude, setlatitude] = useState<number | 0>(0);
  const [longitude, setlongitude] = useState<number | 0>(0);
  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      const { coords } = response;

      // Calcular a direção do movimento
      const angle = coords.heading !== null ? coords.heading : 0;
      console.log("angle: " + angle)
      setLocation(response);

      let bussola;
      let point = '';
      if (angle >= -15 && angle < 15) {
        bussola = -380;
        point = 'norte';
      } else if (angle >= 15 && angle < 75) {
        bussola = -510;
        point = 'nordeste';
      } else if (angle >= 75 && angle < 105) {
        bussola = -640;
        point = 'leste';
      } else if (angle >= 105 && angle < 165) {
        bussola = -760;
        point = 'sudeste';
      } else if (angle >= 165 && angle < 195) {
        bussola = -880;
        point = 'sul';
      } else if (angle >= 195 && angle < 255) {
        bussola = -760;
        point = 'sudoeste';
      } else if (angle >= 255 && angle < 285) {
        bussola = -140;
        point = 'oeste';
      } else if (angle >= 285 && angle < 345) {
        bussola = -260;
        point = 'noroeste';
      } else {
        bussola = -380;
        point = 'norte';
      }

      
      setlatitude(response.coords.latitude)
      setlongitude(response.coords.longitude)
      console.log("latitude: " + latitude)
      console.log("longitude: " + longitude)

      setCarImage(<Image source={spriteImage} style={[styles.sprite, { left: 1 * bussola, width: 1000, height: 1000 }]} />);
    });
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            ref={(ref) => {
              if (ref !== null) {
                markerRef.current = ref as CustomMarkerType;
              }
            }}
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            centerOffset={{ x: 0.5, y: 0.5 }}
          >
            <View style={{ width: 100, height: 100 }}>
              {carImage}
            </View>
          </Marker>
        </MapView>
      )}
    </View>
  );
}
