// popup for making new installations
import { useState, useEffect, } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import Box from "../components/Box";
import PillButton from "./PillButton";
import logoIcon from "../assets/logo.png";
import Tooltip from "./Tooltip";
import { Info } from "lucide-react";
import { useInstallations } from "../context/InstallationsContext";
import { writeTextFile } from "@tauri-apps/plugin-fs";



function NewInstallationModal({isOpen, onClose, onCreate}) {
    const { profilesPath, loadInstallations } = useInstallations();
    const [mcVersion, setMcVersion] = useState("");
    const [versions, setVersions] = useState([]);
    const [modLoader, setModLoader] = useState("vanilla");
    const [name, setName] = useState("");
    const [systemRam, setSystemRam] = useState(8);
    const [allocatedRam, setAllocatedRam] = useState(4);
    const [modpackPath, setModpackPath] = useState("");
    const [useModpack, setUseModpack] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setName("");
        setModpackPath("");
        setMcVersion("");
        setModLoader("vanilla");
        setUseModpack(false);
        invoke("get_system_ram").then(ram => {
            console.log(ram);
            setSystemRam(ram);
            setAllocatedRam(ram >= 8 ? Math.floor(ram / 2) : 2);
        });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
            .then(res => res.json())
            .then(data => {
                // data.versions is an array of version objects
                // each one has a .id (like "1.21.4") and a .type ("release" or "snapshot")
                // filter to only releases:
                //const releases = data.versions.filter(v => v.type === "release");
                const releases = data.versions.filter(v => v.type === "release");
                setVersions(data.versions); // keep all versions in the list
                setMcVersion(releases[0].id); // but default to latest stable release

            });

    }, [isOpen]);

    const create_installation = async () => {
        // creates folder
        await invoke("create_installation", { profilesPath, name });

        //make json config thing for that installation
        const json = {
            name,
            mcVersion,
            modLoader,
            allocatedRam
        };
        await writeTextFile(`${profilesPath}/${name}/config.json`, JSON.stringify(json));

        //refresh installations and close
        await loadInstallations();
        onClose();
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="absolute inset-0 flex items-center jusify-center z-50 pointer-events-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

                    <motion.div
                        className="relative z-10 w-full max-w-md mx-auto tracking-0.02"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >   
                        <Box noMargin>
                            <h2 className="text-white/90 text-2xl tracking-0.02 flex items-center gap-2 mb-4">
                                <img src={logoIcon} className="w-6 h-6" />
                                New Installation
                            </h2>

                            <hr className="border-white/20" />

                            <div className="flex items-center gap-4 mt-4">
                                <label className="text-white/80 text-lg whitespace-nowrap">Installation Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 border border-orange-200/20 rounded-lg p-2 bg-orange-950/20 backdrop-blur-md text-white/60 placeholder:text-white/20"
                                    placeholder="Enter a cool-ass name"
                                />
                            </div>

                            <hr className="border-white/20 mt-4 mb-4" />

                            <div className="flex flex-col gap-2 mt-4">
                                <label className="text-white/80 text-lg">Game Version:</label>
                                <div className="flex gap-4">
                                    <select className="flex-1 border border-orange-200/20 rounded-lg p-2 bg-orange-950/20 backdrop-blur-md text-white/60" value={mcVersion} onChange={e => setMcVersion(e.target.value)}>
                                        {versions.map(v => (
                                            <option key={v.id} value={v.id}>{v.id}</option>
                                        ))}
                                    </select>
                                    <select className="border border-orange-200/20 rounded-lg p-2 bg-orange-950/20 backdrop-blur-md text-white/60" value={modLoader} onChange={e => setModLoader(e.target.value)}>
                                        <option>Vanilla</option>
                                        <option>Fabric</option>
                                        <option>Forge</option>
                                        <option>Optifine</option>
                                        <option>NeoForge</option>
                                        <option>Quilt</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="border-white/20 mt-4 mb-4" />

                            <div className="flex flex-col gap-2 mt-4">
                                <label className="text-white/80 text-lg">Memory:</label>
                                <input type="range" className="w-full accent-orange-800" value={allocatedRam} max={systemRam} min={1} onChange={e => setAllocatedRam(Number(e.target.value))}>       
                                </input>
                                <div className="text-orange-100/40"><h3>{allocatedRam}GB allocated out of ~{systemRam}GB total. <Tooltip text="We reccomend allocating around half of your system RAM."><Info size={14} className="text-white/30 cursor-default" /></Tooltip></h3></div>
                            </div>

                            <hr className="border-white/20 mt-4 mb-4" />

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <span className="text-white/80 text-lg">Import Modrinth Modpack: </span>
                                    <input
                                        type="checkbox"
                                        checked={useModpack}
                                        onChange={e => setUseModpack(e.target.checked)}
                                        className="accent-orange-800"
                                    />
                                </label>

                                {useModpack && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 mt-2"
                                    >
                                        <button
                                            onClick={async () => {
                                                const selected = await open({
                                                    filters: [{ name: "Modrinth Modpack", extensions: ["mrpack"] }]
                                                });
                                                if (selected) setModpackPath(selected);
                                            }}
                                            className="border border-orange-200/20 rounded-lg px-4 py-2 bg-orange-950/20 text-white/50 text-sm hover:border-orange-200/40 transition-colors"
                                        >
                                            Browse
                                        </button>
                                        <span className="text-white/40 text-sm truncate">
                                            {modpackPath ? modpackPath.split("\\").pop() : "No file selected"}
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                            <hr className="border-white/20 mt-4 mb-4" />
                            <div className="flex justify-between mt-4">
                                <PillButton onClick={onClose} color="red">Cancel</PillButton>
                                <PillButton color="green" onClick={create_installation}>Create</PillButton>

                            </div>
                        </Box>
                    </motion.div>    
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default NewInstallationModal; 