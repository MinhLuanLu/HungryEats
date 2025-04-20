import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Example({ item, onDelete }) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) { // Only allow left swipe
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < -100) {
        // Swipe past threshold — remove item
        onDelete && onDelete(item);
        translateX.value = withTiming(-500); // Optional: animate it off-screen
      } else {
        // Not far enough, snap back
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const deleteButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [-100, -50], [1, 0], 'clamp'),
    };
  });

  return (
    <View style={styles.itemWrapper}>
      {/* Background DELETE button */}
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteButtonContent}>
          <Text style={styles.deleteText}>DELETE</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Swipeable foreground */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.itemContainer, animatedStyle]}>
          <Text style={styles.itemText}>{item.Food_name || 'Food item'}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  itemContainer: {
    backgroundColor: '#e0e0e0',
    height: 100,
    justifyContent: 'center',
    paddingLeft: 20,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  deleteButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
