import { Platform } from "react-native";
import Reactotron from "reactotron-react-native";

const getReactotronHost = () => {
  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  return "localhost";
};

const reactotron = Reactotron.configure({
  name: "CARa",
  host: getReactotronHost(),
})
  .useReactNative({
    asyncStorage: true,
    networking: {
      ignoreUrls: /symbolicate|logs/,
    },
  })
  .connect();

if (reactotron.clear) {
  reactotron.clear();
}

console.tron = reactotron;

export default reactotron;
