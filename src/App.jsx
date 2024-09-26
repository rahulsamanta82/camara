import AnimatedComponent from "./component/Animated";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Getimage from "./component/Getimage";
export default function App() {
  return (
   <>
      <BrowserRouter>
   <Routes>
    <Route path="/" element={<AnimatedComponent />} />
    <Route path="/get-data" element={<Getimage />} />
   </Routes>
   </BrowserRouter>
   </>
  )
}