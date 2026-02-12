import {
  GestureResponderEvent,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  DimensionValue,
  Image,
} from "react-native";

import React from "react";

interface ButtonProp {
  onPress?: (event: GestureResponderEvent) => void;
  text?: string;
  disabled?: boolean;
  style?: ViewStyle;
  widthPercent?: DimensionValue;
  heightPercent?: DimensionValue;
  colorButton?: string;
  colorText?: string;
  fontSizeText?: number;
  pathToImage?: string;
}

const Button = ({
  style,
  text,
  colorButton = "#48465eff",
  fontSizeText = 10,
  colorText = "#89c8e2ff",
  onPress,
  widthPercent,
  heightPercent,
  disabled = false,
  pathToImage = "",
}: ButtonProp) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? "#15141cff" : colorButton,
        },
        widthPercent ? { width: widthPercent } : {},
        heightPercent ? { height: heightPercent } : {},
        style,
      ]}
      activeOpacity={0.8}
      onPress={disabled ? undefined : onPress}
    >
      {/* Внутренний контейнер */}
      <View style={styles.inner}>
        {pathToImage ? (
          <Image source={{ uri: pathToImage }} style={styles.image} />
        ) : null}

        <Text
          allowFontScaling={false}
          numberOfLines={2}
          style={[
            styles.text,
            {
              fontSize: fontSizeText,
              lineHeight: fontSizeText, // 🔥 фикс вертикального центра
              color: colorText,
            },
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    overflow: "hidden",
  },

  // Контейнер для центрирования
  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center", // вертикально
    justifyContent: "center", // горизонтально
    paddingHorizontal: 10,
  },

  text: {
    textAlign: "center",
    textAlignVertical: "center", // Android fix
    fontWeight: "500",
  },

  image: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 6,
  },
});

export default Button;
