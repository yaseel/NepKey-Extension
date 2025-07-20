import {
    Route,
    Routes
} from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.tsx";
import {SETTINGS_PATH} from "./constants.ts";
import {useEffect} from "react";
import { useSettings } from "./hooks/useSettings";
import i18n from "./i18n";

function App() {
    const { settings, loading } = useSettings();

    useEffect(() => {
        if (!loading) {
            i18n.changeLanguage(settings.language);
        }
    }, [loading, settings.language]);

    if (loading) {
        return <div>Loading...</div>; // or your spinner
    }

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path={SETTINGS_PATH} element={<SettingsPage/>}/>
        </Routes>
    );
}

export default App;
