import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform, ImageBackground
} from "react-native";
import * as Location from "expo-location";
import WeatherSummary from "./components/WeatherSummary";
import UnitPicker from "./components/UnitPicker";
import RefreshIcon from "./components/RefreshIcon";
import WeatherDetails from "./components/WeatherDetails";
import { colors } from "./utils/index";

const WEATHER_API_KEY = "c1773f604c667933f53ae1153e6a6e49"; //use your own API key
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentWeatherDetails, setCurrentWeatherDetails] = useState(null);
  const [unitsSystem, setUnitsSystem] = useState("metric");

  const fetchWeatherInformation = async () => {
    setCurrentWeatherDetails(null);
    setCurrentWeather(null);
    setErrorMessage(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != "granted") {
        setErrorMessage("Access is needed to run the app");
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      console.log("user location", location);

      const { latitude, longitude } = location.coords;
      console.log("user lat and lng", latitude, longitude);

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;
      const response = await fetch(weatherUrl);
      const result = await response.json();
      console.log("weather results", result);
      
      if (response) {
        setCurrentWeather(result.main.temp);
        setCurrentWeatherDetails(result);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchWeatherInformation();
  }, [unitsSystem]);

  if (currentWeatherDetails) {
    return (
      <View style={styles.container}>
         <ImageBackground
        source={require('./components/images/i22.jpg')}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
        >
        <StatusBar style="auto" />
       
        <View style={styles.main}>
          {/* Select Temperature - Celsius or Fahrenheit */}
          <UnitPicker unitItem={unitsSystem} setUnitItem={setUnitsSystem} />

          {/* Refresh Icon */}
          <RefreshIcon load={fetchWeatherInformation} />

          {/* Weather Summary */}
          <WeatherSummary
            currentWeather={currentWeather}
            currentWeatherDetails={currentWeatherDetails}
          ></WeatherSummary>

        </View>
       
        {/* Weather Details */}
        <WeatherDetails
          currentWeatherDetails={currentWeatherDetails}
          unitsSystem={unitsSystem}
        />
         </ImageBackground>
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
       
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Platform.OS === "ios" ? 12 : 0,
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  main: {
    flex: 1,
    justifyContent: "center",
  },
});

export default App;
