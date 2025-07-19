import {
    Route,
    Routes
} from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import {SETTINGS_PATH} from "./constants.ts";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path={SETTINGS_PATH} element={<Settings/>}/>
        </Routes>
    );
}

export default App;
