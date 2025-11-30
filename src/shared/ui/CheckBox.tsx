import React, { useState, useRef, useEffect } from "react";
import { TouchableWithoutFeedback, Animated, StyleSheet, Easing} from "react-native";

export interface ModernCheckboxProps {
  size?: number;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  color?:string;
  disabled?:boolean
}

export const Checkbox: React.FC<ModernCheckboxProps> = ({
  size = 40,
  value = false,
  onValueChange,
  color = "#4A90E2",
  disabled = false
}) => {
  const [checked, setChecked] = useState(value);
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: checked ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [checked, animation]);

  const toggle = () => {
    // Ripple animation
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 2,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();

    // Circle scale effect
    scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: false,
    }).start();

    setChecked(prev => !prev);
    if (onValueChange) {onValueChange(!checked);}
  };

  const circlePosition = animation.interpolate({
    inputRange: [0, 0.27],
    outputRange: [4, size - 2 - size / 2],
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
    <TouchableWithoutFeedback onPress={toggle} disabled={disabled}>
      <Animated.View
        style={[
          styles.container,
          {
            width: size * 2,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.ripple,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            {
              width: size / 2,
              height: size / 2,
              borderRadius: size / 4,
              transform: [
                { translateX: circlePosition },
                { scale: scaleAnim },
              ],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 3,
            },
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
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
