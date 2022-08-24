import React, { useContext, useState, useEffect, useRef } from 'react';
import { ObjectId } from 'bson';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Button, HStack, Image, VStack, Box, Actionsheet } from 'native-base';

import { Icon, ModalConfirmation } from '../../components/pure';
import { MaterialCommunityIcons, Entypo } from '../../assets/icons';
import { base64image } from './base64';

const CameraContext = React.createContext(null);

const PictureTaker = ({
  isOpen,
  cameraRef,
  onCameraReady,
  close,
  take
}) => {
  return (
    <Actionsheet isOpen={isOpen}>
      <Camera flex={1} width="100%" justifyContent="flex-end" alignItems="center" ref={cameraRef} onCameraReady={onCameraReady}>
        <Box position="absolute" top={2} right={2}>
          <Icon onPress={close} family={Entypo} name="cross" size="xs" color="white" />
        </Box>
        <Icon onPress={take} disabled={!true} family={MaterialCommunityIcons} name="camera" size={40} color="white" />
      </Camera>
    </Actionsheet>
  )
}

const PictureReviewer = ({
  isOpen,
  close,
  save,
  isSaveDisabled,
  photo
}) => {
  return (
    <Actionsheet isOpen={isOpen}>
      <HStack backgroundColor="gray.50" flex={1} alignItems="center" justifyContent="center">
        <VStack backgroundColor="gray.50" flex={1} alignItems="center">
          <Image
            source={{
              uri: "data:image/jpeg;base64," + photo?.base64
            }} alt="Alternate Text" size="xl"
          />
        </VStack>
        <HStack position="absolute" bottom={2} justifyContent="space-evenly">
          <Button onPress={close} mr={2}>Retour</Button>
          <Button onPress={save} isDisabled={isSaveDisabled}>Valider</Button>
        </HStack>
      </HStack>
    </Actionsheet>
  )
}

const CameraProvider = ({ saveDir : saveDirArg, children }) => {
  let cameraRef = useRef();
  const saveDir = FileSystem.documentDirectory + saveDirArg + (saveDirArg[saveDirArg.length - 1] === '/' ? '' : '/');
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [saveDirExists, setSaveDirExists] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [photo, setPhoto] = useState();
  const onSaveSuccessRef = useRef(() => null);
  const [showCamera, f] = useState(false);
  const setShowCamera = (arg) => {
    f(arg);
    if (!arg) {
      setCameraReady(false);
      onSaveSuccessRef.current = () => null;
    }
  }

  const [accessDenied, setAccessDenied] = useState(false);

  // get the permissions necessary to use the camera and share pictures with the media library
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const dirInfo = await FileSystem.getInfoAsync(saveDir);
      if (!dirInfo.exists) {
        console.log('Save directory doesn\'t exist, creating...');
        await FileSystem.makeDirectoryAsync(saveDir, { intermediates: true });
      }
      setSaveDirExists(true);
      setHasCameraPermission(cameraPermission.status === 'granted');
      // setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  const takePic = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false
    }

    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    // setPhoto({
    //   uri: 'https://wallpaperaccess.com/full/317501.jpg',   // uncomment this function call and comment the above call when on emulator
    //   base64: base64image
    // })
  }

  const savePic = () => {
    const uri = saveDir + `${new ObjectId()}.jpeg`;
    FileSystem.copyAsync({ from : photo.uri, to : uri }).then(() => {
    // FileSystem.downloadAsync(photo.uri, uri).then(() => {            // uncomment this line and comment the above line when on emulator
      onSaveSuccessRef.current(uri);
      setPhoto(undefined);
      setShowCamera(false);
    });
  }

  const open = (onSaveSuccess) => {
    if (hasCameraPermission){
      setShowCamera(true);
      onSaveSuccessRef.current = onSaveSuccess;
    } else {
      setAccessDenied(true);
    }
  }

  // Render the children within the CameraContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useCamera hook.
  return (
    <CameraContext.Provider
      value={{
        open,
        hasCameraPermission,
        show: showCamera
      }}
    >
      { children }
      <PictureTaker
        isOpen={showCamera}
        cameraRef={cameraRef}
        onCameraReady={() => setCameraReady(true)}
        close={() => setShowCamera(false)}
        take={takePic}
      />
      <PictureReviewer isOpen={!!photo} close={() => setPhoto(undefined)} save={savePic} isSaveDisabled={!saveDirExists} photo={photo} />
      {
        accessDenied ?
        <ModalConfirmation
          show={true}
          close={() => setAccessDenied(false)}
          confirm={() => setAccessDenied(false)}
          header="Accès à la caméra impossible"
          body="Vous n'avez pas autorisé l'accès à la caméra ou aux photos. Changer ce paramètre dans les réglages de l'application."
          confirmLabel="OK"
        />
        : null
      }
    </CameraContext.Provider>
  );
}

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
