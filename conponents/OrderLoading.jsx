import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Modal, Dimensions } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, useDerivedValue , useAnimatedStyle} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';
import LottieView from 'lottie-react-native';  // Assuming you're using this package
import Map_Style_Light from '../mapStyle';
import { ReText } from 'react-native-redash';
import { FONT } from '../fontConfig';

const store = {"Store_id":1,"User_id":11,"Store_name":"Sota Sushi","Address":"Vestergade 48, Aarhus C","PostCode":8000,"Latitude":56.1578,"Longitude":10.2019,"Location":"Midtjylland","Status":1,"Store_description":"Smag på japan. Siden 2009 har vi haft vores japanske restaurant her i Vestergade 48 i Aarhus.","Phone_number":86474788,"Store_image":"Sota-Sushi.jpg","Created_at":"2024-12-09T07:06:28.000Z"}

export default function OrderLoading({ display, initialLatitude, initialLongitude }) {
    const mapRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;

    const [latitude, setLatitude] = useState(initialLatitude || 56.157798767089844);
    const [longitude, setLongitude] = useState(initialLongitude || 10.201899528503418);

    const CIRCLE_RADIUS = 40;
    const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
    const percent = useSharedValue(0);
    const width = useSharedValue(-15)
    const CircleAnimated = Animated.createAnimatedComponent(Circle);

    const region = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCUMFERENCE * (1 - percent.value),  // Make sure it's decreasing or increasing based on percent
    }));

    const processText = useDerivedValue(() => {
        return `${Math.floor(percent.value * 100)}%`; // Display percentage progress
    });

    // Example logic to simulate progress
    useEffect(() => {
        width.value = withTiming(screenWidth - 15, {duration:5000})
        const interval = setInterval(() => {
            if (percent.value < 1) {
                percent.value = withTiming(percent.value + 0.01, { duration: 100 });
            }
        }, 100);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const carAnimation = useAnimatedStyle(()=>{
        return{
            transform: [{translateX: width.value}]
        }
    })

    return (
        <Modal animationType="slide" visible={display}>
            <View style={styles.container}>
                {/* Map Container */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        //showsUserLocation={true}
                        //provider={PROVIDER_GOOGLE}
                        customMapStyle={Map_Style_Light}
                        showsCompass={false}
                        toolbarEnabled={false}
                        showsMyLocationButton={false}
                        paddingAdjustmentBehavior="always"
                        region={region}
                    >
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude,
                            }}
                            title="Your Marker"
                            description="This is the marker location."
                        />
                    </MapView>
                </View>

                {/* Progress Circle and Lottie Animation */}
                <View style={{ width: '100%', height: '70%' }}>
                    <View style={{ width: '100%', height: '30%', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                        <Svg width={'100%'} height={'100%'} viewBox="0 0 150 150">
                            <Circle
                                cx="75"
                                cy="75"
                                r={CIRCLE_RADIUS}
                                stroke="rgba(184, 184, 184, 0.3)"
                                strokeWidth={5}
                                fill="none"
                            />
                            <CircleAnimated
                                cx="75"
                                cy="75"
                                r={CIRCLE_RADIUS}
                                stroke="#008080"
                                strokeWidth={3}
                                fill="none"
                                strokeDasharray={CIRCUMFERENCE}
                                animatedProps={animatedProps}
                                strokeLinecap="round"
                                rotation="-90" // start from top
                                origin="75, 75"
                            />
                        </Svg>
                        <ReText text={processText} style={{ position: 'absolute', fontSize: 15, fontFamily: FONT.SoraMedium }} />
                    </View>

                    <View style={{borderBottomWidth:1, width:'98%', alignSelf:'center', borderStyle:'dotted'}}>
                        <Animated.View style={[carAnimation]}>
                            <LottieView
                                autoPlay
                                source={require('../assets/lottie/deliveryCar.json')}
                                style={{ width: 50, height: 30 }}
                            />
                        </Animated.View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor:'#ffffff'
    },

    mapContainer: {
        width: '100%',
        height: '30%',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
