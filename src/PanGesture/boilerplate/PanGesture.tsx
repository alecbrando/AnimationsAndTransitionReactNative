import * as React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Constants from "expo-constants";

import { Card, StyleGuide, cards } from "../../components";
import Animated, { Value, cond, block, eq, set, add } from 'react-native-reanimated';
import { onGestureEvent, clamp } from 'react-native-redash';
import { CARD_HEIGHT, CARD_WIDTH } from "../../components/Card";
import { diffClamp } from 'react-native-redash';


const { width, height } = Dimensions.get("window");
const containerWidth = width;
const containerHeight = height - Constants.statusBarHeight - 44;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
  },
})
const [card] = cards;

const withOffSet = (value: Animated.Value<number>, state: Animated.Value<State>,  offSet: Animated.Value<number> = new Value(0)) => {

  return block([
    cond(eq(state, State.END), [set(offSet, add(offSet, value)), offSet], add(offSet, value))
  ])
}

const PanGesture = () => {
  const state = new Value(State.UNDETERMINED)
  const translationX = new Value(0)
  const translationY = new Value(0)
  const offsetX = new Value((containerWidth - CARD_WIDTH) / 2)
  const offsetY = new Value((containerHeight - CARD_HEIGHT) / 2)
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
  })

const translateX = diffClamp(withOffSet(translationX, state, offsetX), 0, containerWidth - CARD_WIDTH)
const translateY = diffClamp(withOffSet(translationY, state, offsetY), 0, containerHeight - CARD_HEIGHT)

  return (
    <View style={styles.container}>
      <PanGestureHandler
        {...gestureHandler}
      >
        <Animated.View style={{transform: [{translateX}, {translateY}]}}>
          <Card {...{ card }} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default PanGesture;
