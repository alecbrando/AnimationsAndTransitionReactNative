import React, {useState, useRef} from "react";
import { StyleSheet, View, Dimensions,  } from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";

import { FlexibleCard, Selection, StyleGuide, cards } from "../../components";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
  },
});

const layouts = [
  {
      id: 'column',
  name: 'Column',
  layout: {
    container: {

      }
    }
  },
  {
    id: 'row',
    name: 'Row',
    layout: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
       }
    }
  },
  {
    id: "wrap",
    name: "Wrap",
    layout: {
      container: {
        flexDirection: "row",
        flexWrap: "wrap",
      },
      child: {
        flex: 0,
        width: width / 2 - StyleGuide.spacing * 2,
      },
    },
  }
]


const transition = <Transition.Change durationMs={400} interpolation="easeInOut" />

const Transitions = () => {
  const ref = useRef<TransitioningView>(null)
  const [currentLayout, setCurrentLayout] = useState(layouts[0].layout)
  return (
    <>
    <Transitioning.View style={[styles.container, currentLayout.container]} {...{ref, transition}}>
      {cards.map((card) => (
        <FlexibleCard key={card.id} style={currentLayout.child} {...{ card }} />
      ))}
    </Transitioning.View>
    <View>
      {
        layouts.map((layout) => {
          return <Selection key={layout.id} name={layout.name} isSelected={layout.layout === currentLayout} onPress={() => {
            if(ref.current){
              ref.current.animateNextTransition()
            }
            setCurrentLayout(layout.layout)}} />
        })
      }
      </View>
    </>
  );
};

export default Transitions;
