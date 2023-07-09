/* eslint-disable no-console */
import rimraf from 'rimraf';

// Specify the path to your build folder
const buildFolderPath = './build';

// Clean the build folder using rimraf
rimraf(buildFolderPath, (error) => {
  if (error) {
    console.error(`Error cleaning build folder: ${error}`);
  } else {
    console.log('Build folder cleaned successfully.');
  }
});
