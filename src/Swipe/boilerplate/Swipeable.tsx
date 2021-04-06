// interface SwipeableProps {}
import React from 'react'

import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {useCode, Value, block, set, and, eq, clockRunning, stopClock, cond, not, startClock, spring, add, Clock} from "react-native-reanimated";
import { StyleSheet } from 'react-native';
import { State } from 'react-native-gesture-handler';
import { onGestureEvent } from 'react-native-redash';
import { withSpring } from "../../components";



export type SwipeablePropsType = {
  translateX: Animated.Value<number>
  translateY: Animated.Value<number>
  snapPoints: number[]
  offsetX: Animated.Value<number>
  offsetY: Animated.Value<number>
}

const Swipeable = ({translateX, translateY, offsetX = new Value(0), offsetY = new Value(0), snapPoints}: SwipeablePropsType) => {
  const translationX = new Value(0)
  const translationY = new Value(0)
  const velocityX = new Value(0)
  const velocityY = new Value(0)
  const state = new Value(State.UNDETERMINED)
  const gestureHandler = onGestureEvent({
    translationX,
    translationY,
    velocityX,
    velocityY,
    state
  })

  const x = withSpring({
    value: translationX,
    velocity: velocityX,
    state,
    offset: offsetX,
    snapPoints
  })

  const y = withSpring({ 
    value: translationY,
    velocity: velocityY,
    state,
    offset: offsetY,
    snapPoints
})

useCode(() => block([set(translateX, x), set(translateY, y)]), [
  translateX,
  translateY,
  x,
  y,
]);

  return <PanGestureHandler {...gestureHandler}>
    <Animated.View style={StyleSheet.absoluteFill}/>
  </PanGestureHandler>
};

export default Swipeable;
