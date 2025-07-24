import {
    Route,
    Routes
} from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.tsx";
import {SETTINGS_PATH} from "./constants.ts";
import { useEffect, useState } from "react";
import { useSettings } from "./hooks/useSettings";
import i18n from "./i18n";
import Spinner from "./common/Spinner/Spinner";

function App() {
    const { settings } = useSettings();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (settings && settings.language) {
            i18n.changeLanguage(settings.language).finally(() => setLoading(false));
        }
    }, [settings.language]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path={SETTINGS_PATH} element={<SettingsPage/>}/>
        </Routes>
    );
}

export default App;
