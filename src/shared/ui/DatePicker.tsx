import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export interface ModernDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

const DatePicker: React.FC<ModernDatePickerProps> = ({ value, onChange }) => {
  const [date, setDate] = useState<Date | undefined>(value);
  const [text, setText] = useState<string>(value ? formatDate(value) : "");
  const [isPickerVisible, setPickerVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // -------- FORMATTING --------
  function formatDate(date: Date) {
    const dd = date.getDate().toString().padStart(2, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  function parseDate(str: string): Date | null {
    const parts = str.split(".");
    if (parts.length !== 3) return null;

    const [dd, mm, yyyy] = parts.map(n => parseInt(n, 10));

    if (!dd || !mm || !yyyy) return null;
    if (mm < 1 || mm > 12) return null;
    if (dd < 1 || dd > 31) return null;

    const d = new Date(yyyy, mm - 1, dd);
    if (isNaN(d.getTime())) return null;

    return d;
  }

  // -------- INPUT MASKING --------
  const handleInput = (value: string) => {
    const digits = value.replace(/\D/g, "");

    let result = "";
    if (digits.length <= 2) result = digits;
    else if (digits.length <= 4) result = `${digits.slice(0, 2)}.${digits.slice(2)}`;
    else result = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;

    setText(result);

    const parsed = parseDate(result);
    if (parsed) {
      setDate(parsed);
      onChange?.(parsed);
    }
  };

  // -------- DATE PICKER --------
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    const formatted = formatDate(selectedDate);
    setText(formatted);
    setPickerVisible(false);
    onChange?.(selectedDate);
  };

  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={text}
          onChangeText={handleInput}
          placeholder="ДД.ММ.ГГГГ"
          maxLength={10}
        />

        <TouchableOpacity onPress={() => setPickerVisible(true)}>
          <Image
            source={require("D:/GetWatchApp/recourses/icons/iconsCalendar.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        date={date || new Date()}
        display="calendar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f0f4f8",
    borderRadius: 12,
    elevation: 5
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#5b6b6dff"
  },

  icon: {
    width: 20,
    height: 20,
    marginLeft: 10
  }
});

export default DatePicker;
