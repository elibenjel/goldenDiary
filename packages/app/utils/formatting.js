
export const getFilenameFromURI = (uri) => {
  return uri.split('/').at(-1).split('.')[0];
}