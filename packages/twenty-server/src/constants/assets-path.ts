import path from 'path';

// If the code is built through the testing module, assets are not output to the dist/assets directory.
const IS_BUILT_THROUGH_TESTING_MODULE = !/[\/\\]dist[\/\\]/.test(__dirname);

export const ASSET_PATH = IS_BUILT_THROUGH_TESTING_MODULE
  ? path.resolve(__dirname, `../`)
  : path.resolve(__dirname, `../assets`);
