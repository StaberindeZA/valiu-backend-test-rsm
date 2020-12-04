declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      SERVER_HOST: string;
      IMAGE_FOLDER: string;
      IMAGE_EXTENSION: 'jpeg' | 'png' | undefined;
      IMAGE_MIMETYPE: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}