// imports
// @refresh reset

import { createContext, useContext, useState, useEffect } from "react";
import { readDir, readTextFile, stat } from "@tauri-apps/plugin-fs";


const InstallationsContext = createContext(null);


export function InstallationsProvider({ children }) {
    const [profilesPath, setProfilesPath] = useState(
        localStorage.getItem("profilesPath") || null
    );
    const [installations, setInstallations] = useState([]);

    function updateProfilesPath(path) {
        localStorage.setItem("profilesPath", path);
        setProfilesPath(path);
    }

    useEffect(() => {
        if (!profilesPath) return;

        loadInstallations();
    }, [profilesPath]);

    async function loadInstallations() {
        if (!profilesPath) return;
        const entries = await readDir(profilesPath);
        const folders = entries.filter(e => e.isDirectory);

        const foldersWithStats = await Promise.all(
            folders.map(async f => {
                const s = await stat(`${profilesPath}/${f.name}`);
                return { ...f, mtime: s.mtime };
            })
        );
        foldersWithStats.sort((a, b) => b.mtime - a.mtime);
        
        const loaded = await Promise.all(foldersWithStats.map(async f => {
            const configText = await readTextFile(`${profilesPath}/${f.name}/config.json`);
            const config = JSON.parse(configText);
            return {
                name: f.name,
                path: `${profilesPath}\\${f.name}`,
                displayName: config.name,
                mcVersion: config.mcVersion,
                modLoader: config.modLoader,
                allocatedRam: config.allocatedRam,
            };
        }));
        
        setInstallations(loaded);
    }


    return (
        <InstallationsContext.Provider value={{
            profilesPath,
            updateProfilesPath,
            installations,
            setInstallations,
            loadInstallations
        }}>
            {children}
        </InstallationsContext.Provider>
    );
}

export function useInstallations() {
    return useContext(InstallationsContext);
}
