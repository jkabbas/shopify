import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import ShopContext from "../context/ShopContext";

function App() {

  const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();
  return (
    <>
    <h1>App File</h1>
    <ShopContext />
    </>

  );
}

export default App;
