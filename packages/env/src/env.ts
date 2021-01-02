import * as dotenv from "dotenv";

/**
 * Returns a file name based on NODE_ENV value
 */
function getEnvFileName() {
  switch (process.env.NODE_ENV) {
    case "test":
      return ".env.test";
    default:
      return ".env";
  }
}

dotenv.config({
  path: getEnvFileName(),
});
