import {
    Route,
    Routes
} from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.tsx";
import {SETTINGS_PATH} from "./constants.ts";
import { useEffect } from "react";
import { useSettings } from "./hooks/useSettings";
import Spinner from "./common/Spinner/Spinner";
import {applyLanguage} from "./helpers/applyLanguage.ts";

function App() {
    const { settings, loaded } = useSettings();

    useEffect(() => {
        if (loaded && settings.language) {
            (async () => {
                await applyLanguage(settings.language);
            })();
        }

    }, [loaded, settings.language]);

    if (!loaded) {
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
