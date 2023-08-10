// Inspiration: https://twitter.com/Njoya17075607/status/1673228304982179840

import Constants from "expo-constants";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
const { width } = Dimensions.get("window");
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import data, { locationImage } from "./src/data";

const duration = 300;
const _size = width * 0.9;
const layout = {
  borderRadius: 16,
  width: _size,
  height: _size * 1.27,
  spacing: 12,
  cardsGap: 22,
};
const maxVisibleItems = 6;

const colors = {
  primary: "#6667AB",
  light: "#fff",
  dark: "#111",
};

function Card({
  info,
  index,
  totalLength,
  activeIndex,
}: {
  totalLength: number;
  index: number;
  info: (typeof data)[0];
  activeIndex: SharedValue<number>;
}) {
  const stylez = useAnimatedStyle(() => {
    return {
      position: "absolute",
      zIndex: totalLength - index,
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [1 - 1 / maxVisibleItems, 1, 1]
      ),
      transform: [
        {
          translateY: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [-layout.cardsGap, 0, layout.height + layout.cardsGap]
          ),
        },
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [0.96, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, stylez]}>
      <Text
        style={[
          styles.title,
          {
            position: "absolute",
            top: -layout.spacing,
            right: layout.spacing,
            fontSize: 102,
            color: colors.primary,
            opacity: 0.05,
          },
        ]}
      >
        {index}
      </Text>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{info.type}</Text>
        <View style={styles.row}>
          <Entypo name="clock" size={16} style={styles.icon} />
          <Text style={styles.subtitle}>
            {info.from} - {info.to}
          </Text>
        </View>
        <View style={styles.row}>
          <Entypo name="location" size={16} style={styles.icon} />
          <Text style={styles.subtitle}>{info.distance} km</Text>
        </View>
        <View style={styles.row}>
          <Entypo name="suitcase" size={16} style={styles.icon} />
          <Text style={styles.subtitle}>{info.role}</Text>
        </View>
      </View>
      <Image source={{ uri: locationImage }} style={styles.locationImage} />
    </Animated.View>
  );
}

export default function App() {
  const activeIndex = useSharedValue(0);

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (activeIndex.value === 0) {
        return;
      }
      activeIndex.value = withTiming(activeIndex.value - 1, { duration });
      console.log("fling up");
    });
  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (activeIndex.value === data.length) {
        return;
      }
      activeIndex.value = withTiming(activeIndex.value + 1, { duration });
      console.log("fling down");
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar hidden />
      <GestureDetector gesture={Gesture.Exclusive(flingUp, flingDown)}>
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
            marginBottom: layout.cardsGap * 2,
          }}
          pointerEvents="box-none"
        >
          {data.map((c, index) => {
            return (
              <Card
                info={c}
                key={c.id}
                activeIndex={activeIndex}
                index={index}
                totalLength={data.length - 1}
              />
            );
          })}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.primary,
    padding: layout.spacing,
  },
  card: {
    borderRadius: layout.borderRadius,
    width: layout.width,
    height: layout.height,
    padding: layout.spacing,
    backgroundColor: colors.light,
  },
  title: { fontSize: 32, fontWeight: "600" },
  subtitle: {},
  cardContent: {
    gap: layout.spacing,
    marginBottom: layout.spacing,
  },
  locationImage: {
    flex: 1,
    borderRadius: layout.borderRadius - layout.spacing / 2,
  },
  row: {
    flexDirection: "row",
    columnGap: layout.spacing / 2,
    alignItems: "center",
  },
  icon: {},
});
