import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {Value, startClock, Clock, useCode, cond, eq, add, Extrapolate, set, not, interpolate, proc} from 'react-native-reanimated'
import { useClock, useValues } from "react-native-redash";

import { Button, Card, cards } from "../../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
const duration = 500

const runAnimation = proc((
  startAnimation: Animated.Value<number>,
   clock: Animated.Clock, 
   from: Animated.Value<number>,
    to: Animated.Value<number>,
     startTime: Animated.Value<number>,
      opacity: Animated.Node<number>) => 
      cond(eq(startAnimation, 1), [

  startClock(clock),
  set(from, opacity),
  set(to, not(to)),
  set(startTime, clock),
  set(startAnimation, 0)

]))



const ClockValuesAndIdentity = () => {
  const [show, setShow] = useState(true);
  const clock = useClock()
  const [startTime, from, to] = useValues(0,1,0)
  const startAnimation = new Value(1)
  const endTime = add(startTime, duration)

  const opacity = interpolate(clock, {
    inputRange: [startTime, endTime],
    outputRange: [from, to],
    extrapolate: Extrapolate.CLAMP
  })

  useCode(() => [
    runAnimation(startAnimation, clock, from, to, startTime, opacity)
  ], [clock, from, opacity, startAnimation, startTime, to])

  console.log('RUNNING')

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={{ opacity }}>
          <Card card={cards[0]} />
        </Animated.View>
      </View>
      <Button label={show ? 'Hide' : 'Show'} primary onPress={() => setShow(prev => !prev) }/>
    </View>
  );
};

export default ClockValuesAndIdentity;
