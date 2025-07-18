import {
    Route,
    Routes
} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
        </Routes>
    );
}

export default App;
