// Mock Expo winter runtime to prevent import.meta errors
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
};

// Mock structuredClone for Expo winter runtime
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

// Expo SDK 57 installs its WinterCG globals as enumerable lazy getters that
// `require()` on first access. Jest enumerates globals during teardown, which
// fires any getter still unread after the module registry is gone and throws
// "trying to `import` a file outside of the scope of the test code". Reading
// them here swaps each getter for a plain value while the registry is alive.
for (const name of [
  "fetch",
  "Headers",
  "Request",
  "Response",
  "TextDecoder",
  "TextDecoderStream",
  "TextEncoderStream",
  "URL",
  "URLSearchParams",
  "DOMException",
]) {
  try {
    void global[name];
  } catch {
    // Global not installed on this platform preset; nothing to materialize.
  }
}

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((c) => c),
    Directions: {},
  };
});
