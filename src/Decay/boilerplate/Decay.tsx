import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { Value, cond, set, eq, add, block, Clock, and, neq, not, clockRunning, startClock, stopClock, decay } from "react-native-reanimated";
import Constants from "expo-constants";
import { diffClamp, onGestureEvent } from "react-native-redash";

import { Card, StyleGuide, cards } from "../../components";
import { CARD_HEIGHT, CARD_WIDTH } from "../../components/Card";

const { width, height } = Dimensions.get("window");
const containerWidth = width;
const containerHeight = height - Constants.statusBarHeight - 44;
const offsetX = new Value((containerWidth - CARD_WIDTH) / 2);
const offsetY = new Value((containerHeight - CARD_HEIGHT) / 2);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
  },
});
const [card] = cards;

// TODO: replace with withOffset from redash
const widthDecay = (
  value: Animated.Node<number>,
  gestureState: Animated.Value<State>,
  offset: Animated.Value<number> = new Value(0),
  velocity: Animated.Value<number> = new Value(0)
) =>
{
  const clock = new Clock()
  const state = {
    finished: new Value(0),
    velocity,
    position: new Value(0),
    time: new Value(0)
  }
  const config = {
    deceleration: 0.998
  }

  const decayIsInterrupted = eq(gestureState, State.BEGAN)
  const finishDecay = [
    set(offset, state.position),
    stopClock(clock)
  ]


  return block([
    cond(decayIsInterrupted, finishDecay),
    cond(neq(gestureState, State.END), [set(state.finished, 0), stopClock(clock), set(state.position, add(offset, value))]),
    cond(eq(gestureState, State.END), 
    [cond(and(not(clockRunning(clock)), not(state.finished)), 
      [set(state.velocity, velocity), set(state.time, 0), startClock(clock)]), 
    decay(clock, state, config)]),
    state.position])
}

const Decay = () => {
  //local state
  const state = new Value(State.UNDETERMINED);
  // x position passed to gesture handler
  const translationX = new Value(0);
  //y position passed to gesture handler
  const translationY = new Value(0);
  //x velocity value passed to geture handler
  const velocityX = new Value(0)
  //y velocity value passed to gesture handler
  const velocityY = new Value(0)
  //gesture handler object that is passed to our gesture component that updates the gesture values
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY
  });

  //translate X and Y values that is diffClamp (the difference of values outside of the bounds so that we don't have to swipe a ton for it to be back in bounds... has min and max of window container)
  //as well as widthDecay that takes in the translation X value that is updated by the gesture handler
  //we pass our local state to communicate the gesture State
  //offset is a default position we want our card to be
  //velocity is passed so that we can use decay for the animation 
  const translateX = diffClamp(
    widthDecay(translationX, state, offsetX, velocityX),
    0,
    containerWidth - CARD_WIDTH
  );
  const translateY = diffClamp(
    widthDecay(translationY, state, offsetY, velocityY),
    0,
    containerHeight - CARD_HEIGHT
  );


  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            transform: [{ translateX }, { translateY }],
          }}
        >
          <Card {...{ card }} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Decay;
