import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Grid from './src/components/Grid';
import { initializeGrid, movePlayer, checkTargetReached } from './src/utils/gameLogic';

const App = () => {
    const [gridSize, setGridSize] = useState(4);
    const [gameState, setGameState] = useState(initializeGrid(gridSize));
    const [currentResult, setCurrentResult] = useState(1);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isSwiping, setIsSwiping] = useState(false);

    useEffect(() => {
        console.log('useEffect triggered', gameState.player, gameState.target);
        if (gameState.target === null) {
            // Update score
            const newScore = score + (2048 - currentResult);
            setScore(newScore);

            // Increment level
            setLevel(prevLevel => {
                const newLevel = prevLevel + 1;
                console.log('New level:', newLevel);

                // Initialize new game state
                let newGameState;
                if (newLevel % 10 === 0) {
                    const newSize = gridSize + 1;
                    setGridSize(newSize);
                    newGameState = initializeGrid(newSize);
                } else {
                    newGameState = initializeGrid(gridSize);
                }

                setGameState(newGameState);

                // Reset current result
                setCurrentResult(1);

                return newLevel;
            });
        }
    }, [gameState, score, currentResult, gridSize]);

    const handleSwipe = (gesture) => {
        const { translationX, translationY, state } = gesture.nativeEvent;
        if (state !== State.END) return; // Handle the end of the gesture
        if (isSwiping) return; // Prevent swiping if already swiping

        setIsSwiping(true); // Set isSwiping to true to prevent further swipes

        let direction;
        if (Math.abs(translationX) > Math.abs(translationY)) {
            direction = translationX > 0 ? 'right' : 'left';
        } else {
            direction = translationY > 0 ? 'down' : 'up';
        }

        const { grid, player, targetReached } = movePlayer(gameState.grid, gameState.player, direction);

        if (targetReached) {
            // Trigger useEffect by setting target to null
            setGameState({ grid, player, target: null });
        } else {
            setGameState({ grid, player, target: gameState.target });
        }

        setCurrentResult(prevResult => prevResult * 2);

        // Reset isSwiping after a short delay
        setTimeout(() => {
            setIsSwiping(false);
        }, 200); // Adjust delay as needed
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Exponenia</Text>
                    <Text style={styles.score}>Score: {score}</Text>
                    <Text style={styles.level}>Level: {level}</Text>
                </View>
                <PanGestureHandler onGestureEvent={handleSwipe} onHandlerStateChange={handleSwipe}>
                    <View>
                        <Grid grid={gameState.grid} currentResult={currentResult} />
                    </View>
                </PanGestureHandler>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        margin: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    score: {
        fontSize: 20,
    },
    level: {
        fontSize: 20,
    },
});

export default App;
