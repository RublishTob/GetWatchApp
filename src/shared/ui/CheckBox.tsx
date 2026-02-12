import React, { useState, useRef, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Easing,
  View,
  ViewStyle,
} from "react-native";

export interface ModernCheckboxProps {
  size?: number | string; // px или "50%"
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Checkbox: React.FC<ModernCheckboxProps> = ({
  size = 40,
  value = false,
  onValueChange,
  color = "#4A90E2",
  disabled = false,
  style,
}) => {
  // Реальный размер в px
  const [realSize, setRealSize] = useState<number>(
    typeof size === "number" ? size : 40
  );

  const [checked, setChecked] = useState(value);

  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  // Синхронизация с value
  useEffect(() => {
    setChecked(value);
  }, [value]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: checked ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [checked]);

  const toggle = () => {
    if (disabled) return;

    // Ripple
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 2,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();

    // Scale
    scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: false,
    }).start();

    const newValue = !checked;

    setChecked(newValue);
    onValueChange?.(newValue);
  };

  const s = realSize;

  const circlePosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [4, s * 2 - s / 2 - 4],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E0E0E0", color],
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1.5],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  return (
    <View
      style={style}
      onLayout={(e) => {
        if (typeof size === "string" && size.includes("%")) {
          const parentWidth = e.nativeEvent.layout.width;
          const percent = parseFloat(size) / 100;

          setRealSize(parentWidth * percent);
        }
      }}
    >
      <TouchableWithoutFeedback onPress={toggle} disabled={disabled}>
        <Animated.View
          style={[
            styles.container,
            {
              width: s * 2,
              height: s,
              borderRadius: s / 2,
              backgroundColor,
            },
          ]}
        >
          {/* Ripple */}
          <Animated.View
            style={[
              styles.ripple,
              {
                width: s,
                height: s,
                borderRadius: s / 2,
                transform: [{ scale: rippleScale }],
                opacity: rippleOpacity,
              },
            ]}
          />

          {/* Circle */}
          <Animated.View
            style={[
              styles.circle,
              {
                width: s / 2,
                height: s / 2,
                borderRadius: s / 4,
                transform: [
                  { translateX: circlePosition },
                  { scale: scaleAnim },
                ],
              },
            ]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 2,
    overflow: "hidden",
  },

  circle: {
    backgroundColor: "#fff",
    position: "absolute",
    top: "30%",
  },

  ripple: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
  },
});
