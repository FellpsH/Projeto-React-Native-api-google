import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        flexDirection: 'column',
        paddingTop: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    sprite: {
        width: 60,
        height: 60,
    },
    controlsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 300,
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 20,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    speedControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    speedValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    speedUnit: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 5,
    },
    courseSelection: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 20,
    },
    courseButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedCourseButton: {
        backgroundColor: '#007bff',
    },
    courseButtonText: {
        color: 'black',
        fontSize: 16,
    },
    toggleButton: {

        marginTop: 10,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    languageButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    languageButtonText: {
        color: 'white',
        fontSize: 16,
    },
    destinationMessageContainer: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginEnd: 10,
        width: "auto"
    },
    destinationMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
