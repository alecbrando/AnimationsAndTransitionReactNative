import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Constants from "expo-constants";

import { onGestureEvent } from "react-native-redash";
import { cards, StyleGuide, Card } from "../components";
import { CARD_WIDTH, CARD_HEIGHT } from "../components/Card";

const {
  Clock,
  Value,
  diffClamp,
  cond,
  set,
  eq,
  add,
  decay: reDecay,
  clockRunning,
  startClock,
  stopClock,
  block,
  and,
  not,
  diff
} = Animated;
const { width, height } = Dimensions.get("window");
const containerWidth = width;
const containerHeight = height - Constants.statusBarHeight - 44;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background
  }
});
const [card] = cards;

interface DecayProps {
  clock?: Animated.Clock;
  value: Animated.Adaptable<number>;
  velocity: Animated.Adaptable<number>;
  deceleration?: Animated.Adaptable<number>;
}

const decay = (decayConfig: DecayProps) => {
  const { clock, value, velocity, deceleration } = {
    clock: new Clock(),
    deceleration: 0.998,
    ...decayConfig
  };

  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = { deceleration };

  return [
    cond(and(not(clockRunning(clock)), eq(state.time, 0)), [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(state.time, 0),
      startClock(clock)
    ]),
    reDecay(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ];
};

export const withDecay = (
  value: Animated.Node<number>,
  velocity: Animated.Node<number>,
  state: Animated.Value<State>
) => {
  const clock = new Clock();
  return block([cond(eq(state, State.END), decay({ value, velocity }), value)]);
};

const withOffset = (
  value: Animated.Value<number>,
  state: Animated.Value<State>
) => {
  const offset = new Value(0);
  return cond(
    eq(state, State.END),
    [set(offset, add(offset, value)), offset],
    add(offset, value)
  );
};

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY
  });
  const translateX = withDecay(
    withOffset(translationX, state),
    velocityX,
    state
  );
  const translateY = withDecay(
    withOffset(translationY, state),
    velocityY,
    state
  );
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            transform: [{ translateX }, { translateY }]
          }}
        >
          <Card {...{ card }} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};