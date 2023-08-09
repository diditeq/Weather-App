import { View, StyleSheet } from "react-native";
import React from "react";
import { Picker } from "@react-native-community/picker";

const UnitPicker = ({unitItem , setUnitItem}) => {
  return (
    <View style={styles.unitsSystem}>
      <Picker
        selectedValue={unitItem}
        onValueChange={(itemValue, itemIndex) => setUnitItem(itemValue)}
      >
        <Picker.Item label="C" labelStyle = {styles.labelStyle} value="metric" 

        />
        <Picker.Item label="F" labelStyle = {styles.labelStyle} value="imperial" 
        />
      </Picker>
    </View>
  );
};

export default UnitPicker;

const styles = StyleSheet.create({
  unitsSystem: {
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -30,
      },
      android: {
        top: 30,
      },
    }),

    left: 20,
    height: 50,
    width: 100,
  },

  labelStyle:{
    size: 50,
    color:'green',
    fontsize:30
  },
});
