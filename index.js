import Splash from "./splash";
import Start from "./start"; 
import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  return loading ? <Splash setIsLoading={setLoading} /> : <Start />;
}
