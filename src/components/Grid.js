// src/components/Grid.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const getColor = (value) => {
    switch (value) {
        case 1:
            return '#3498db'; // Player cell color
        case 2:
            return '#2ecc71'; // Target cell color
        case -1:
            return '#34495e'; // Block cell color
        default:
            return '#ecf0f1'; // Default cell color
    }
};

const Grid = ({ grid, currentResult }) => {
    return (
        <View style={styles.grid}>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                        <View key={colIndex} style={[styles.cell, { backgroundColor: getColor(cell) }]}>
                            <Text style={styles.cellText}>{cell === 1 ? currentResult : ''}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 80,
        height: 80,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    cellText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Grid;
