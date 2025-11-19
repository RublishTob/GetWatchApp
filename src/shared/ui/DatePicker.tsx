import React, { useState, useRef, useEffect } from "react";
import { View,TouchableOpacity, StyleSheet, Animated, Easing, Image } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export interface ModernDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

const DatePicker: React.FC<ModernDatePickerProps> = ({ value, onChange}) => {
  const [date, setDate] = useState<Date | undefined>(value);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (date) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [date,fadeAnim]);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setPickerVisible(false);
    if (onChange) {onChange(selectedDate);}
  };

  const handleCancel = () => setPickerVisible(false);

  const formattedDate = date
    ? date.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setPickerVisible(true)} activeOpacity={0.8}>
          <Image source={require('D:/GetWatchApp/recourses/icons/iconsCalendar.png')} style={{width:20,height:20,marginRight:10}}></Image>
          <Animated.Text style={[styles.buttonText, !date && { color: "#aaa" }, { opacity: fadeAnim }]}>
          {formattedDate || "Не выбрано"}
        </Animated.Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        date={date || new Date()}
        display={'calendar'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f0f4f8",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#5b6b6dff",
  },
});

export default DatePicker
