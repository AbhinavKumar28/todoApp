import Path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const staticFileServices = {
  assets: {
    directory: {
      path: Path.join(__dirname, "../../../dist/assets/"),
      index: ["index.html"],
    },
  },
  params: {
    directory: {
      path: Path.join(__dirname, "../../../dist"),
      index: ["index.html"],
    },
  },
};
