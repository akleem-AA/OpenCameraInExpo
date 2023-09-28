import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData);
      setShowCamera(false); // Hide the camera after taking the photo
    }
  };

  const retakePicture = () => {
    setPhoto(null); // Clear the previous photo
    setShowCamera(true); // Show the camera again
  };

  return (
    <View style={{ flex: 1 }}>
      {showCamera ? (
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={takePicture}
            >
              <Text style={{ fontSize: 18, color: 'white' }}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : null}

      {photo && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={{ uri: photo.uri }} style={{ width: 200, height: 200 }} />
          <TouchableOpacity onPress={retakePicture}>
            <Text style={{ fontSize: 18, color: 'blue' }}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
