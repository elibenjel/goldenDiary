import React, { useContext, useState, useEffect, useRef } from "react";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Icon } from "../../components/Icon";
import { MaterialCommunityIcons, Entypo } from '../../assets/icons';
import { Button, HStack, Image, Tooltip, VStack, Box, Actionsheet } from "native-base";

const CameraContext = React.createContext(null);

const CameraProvider = ({ children }) => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [showCamera, setShowCameraBase] = useState(false);
  const setShowCamera = (arg) => {
    setShowCameraBase(arg);
    if (!arg) {
      setCameraReady(false);
    }
  }
  const [cameraReady, setCameraReady] = useState(false);
  const [photo, setPhoto] = useState();
  const [lastSaved, setLastSaved] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  const renderCameraTrigger = () => {
    if (!hasCameraPermission || !hasMediaLibraryPermission) {
      return (
        <Tooltip
          label="Vous n'avez pas autorisé l'accès à la caméra ou aux photos. Vérifier les réglages de l'application."
          openDelay={300}
        >
          <Icon family={MaterialCommunityIcons} name="camera-off" size="xs" />
        </Tooltip>
      )
    }

    return <Icon onPress={() => setShowCamera(true)} family={MaterialCommunityIcons} name="camera-plus" size="xs" />;
  }

  const takePic = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false
    }

    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  }

  const renderCamera = () => {
    if (!showCamera) return;

    if (photo) {
      const savePic = () => {
        MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
          setPhoto(undefined);
          setShowCamera(false);
          setLastSaved(photo.uri);
        });
      }

      return (
        <Center>
          <Image
            source={{
              uri: "data:image/jpeg;base64," + photo.base64
            }} alt="Alternate Text" size="xl"
          />
          <HStack justifyContent="space-evenly">
            <Button onPress={() => setPhoto(undefined)}>Retour</Button>
            <Button onPress={() => savePic()}>Valider</Button>
          </HStack>
        </Center>
      )
    }

    return (
      <Actionsheet isOpen={showCamera}>
        <Camera flex={1} width="100%" justifyContent="flex-end" alignItems="center" ref={cameraRef} onCameraReady={() => setCameraReady(true)}>
          <Box position="absolute" top={2} right={2}>
            <Icon onPress={() => setShowCamera(false)} family={Entypo} name="cross" size="xs" color="white" />
          </Box>
          <Icon onPress={takePic} disabled={!cameraReady} family={MaterialCommunityIcons} name="camera" size={40} color="white" />
        </Camera>
      </Actionsheet>
    )
  }

  // Render the children within the CameraContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useCamera hook.
  return (
    <CameraContext.Provider
      value={{
        renderCameraTrigger,
        renderCamera,
        showCamera,
        lastSaved
      }}
    >
      {
        children
      }
    </CameraContext.Provider>
  );
};

// The useCamera hook can be used by any descendant of the CameraProvider. It
// provides the diary of the user and functions to
// update and reset the diary.
const useCamera = () => {
  const camera = useContext(CameraContext);
  if (camera == null) {
    throw new Error("useCamera() called outside of a CameraProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return camera;
};

export { CameraProvider, useCamera };
