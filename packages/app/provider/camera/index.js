import React, { useContext, useState, useEffect, useRef } from "react";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { ObjectId } from 'bson';
import { Icon } from "../../components/Icon";
import { MaterialCommunityIcons, Entypo } from '../../assets/icons';
import { Button, HStack, Image, Tooltip, VStack, Box, Actionsheet } from "native-base";

const CameraContext = React.createContext(null);

const CameraProvider = ({ saveDir : saveDirArg, children }) => {
  let cameraRef = useRef();
  const saveDir = FileSystem.documentDirectory + saveDir + (saveDir.at(-1) === '/' ? '' : '/');
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [saveDirExists, setSaveDirExists] = useState(false);
  const [showCamera, setShowCameraBase] = useState(false);
  const setShowCamera = (arg) => {
    setShowCameraBase(arg);
    if (!arg) {
      setCameraReady(false);
    }
  }
  const [cameraReady, setCameraReady] = useState(false);
  const [photo, setPhoto] = useState();
  const lastSaved = useRef();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const dirInfo = await FileSystem.getInfoAsync(saveDir);
      if (!dirInfo.exists) {
        console.log("Save directory doesn't exist, creating...");
        await FileSystem.makeDirectoryAsync(saveDir, { intermediates: true });
      }
      setSaveDirExists(true);
      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  const renderCameraTrigger = () => {
    if (!hasCameraPermission) {
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
        const uri = saveDir + `${new ObjectId()}.jpeg`;
        FileSystem.copyAsync({ from : photo.uri, to : uri }).then(() => {
          setPhoto(undefined);
          setShowCamera(false);
          lastSaved.current = uri;
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
            <Button onPress={() => savePic()} isDisabled={!saveDirExists}>Valider</Button>
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
        getLastSaved: () => {
          const uri = lastSaved.current;
          lastSaved.current = undefined;
          return uri;
        },
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
