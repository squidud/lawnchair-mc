import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInstallations } from "../context/InstallationsContext";
import newIcon from "../assets/new.png";
import profileIcon from "../assets/profile.png";
import NewInstallationModal from "./NewInstallationModal";
import PillButton from "./PillButton";
import { Pencil, Trash2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";



const SLOT_WIDTH = 96 + 24; // w-24 (96px) + gap-6 (24px)

function InstallationCarousel() {
    const [selected, setSelected] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { installations, loadInstallations, profilesPath } = useInstallations();
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const delete_installation = async () => {
        if (!selected) return;
        const confirmed = await confirm(
            `Are you sure you want to delete "${selected}"? This shit is final.`,
            { title: "Delete Installation", kind: "warning" }
        );
        if (!confirmed) return;


        // deletes folder
        await invoke("delete_installation", { profilesPath, name: selected });

        //refresh installations 
        await loadInstallations();
    };

    useEffect(() => {
        const measure = () => {
            if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    useEffect(() => {
        if (installations.length > 0) setSelected(installations[0].name);
    }, [installations]);

    useEffect(() => {
        loadInstallations();
    }, []);

    const selectedInstallation = installations.find(i => i.name === selected);

    const selectedIndex = selected === null
        ? 0
        : installations.findIndex(i => i.name === selected) + 1;

    const x = containerWidth / 2 - selectedIndex * SLOT_WIDTH - 48;

    return (
        <div className="flex flex-col items-center w-full">
            {/* carousel row */}
            <div ref={containerRef} className="w-full overflow-hidden relative" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)" }}>

                <motion.div
                    className="flex items-center gap-6 py-4"
                    animate={{ x }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* new installation button */}
                    <motion.button
                        onClick={() => { setSelected(null); setTimeout(() => setModalOpen(true), 400); }}
                        className="flex-shrink-0 w-24 flex items-center justify-center pointer-events-auto"
                        whileHover={{ scale: 1.05 }}
                        animate={{
                            opacity: selected !== null ? 0.6 : 1,
                            filter: `blur(${selectedIndex * 2}px)`,
                            scale: selected === null ? 1.5 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <img src={newIcon} alt="New Installation" className="w-16 h-16" />
                    </motion.button>

                    {/* installation buttons */}
                    {installations.map((install, index) => {
                        const isSelected = selected === install.name;
                        return (
                            <motion.button
                                key={install.name}
                                onClick={() => setSelected(install.name)}
                                className="flex-shrink-0 w-24 flex items-center justify-center pointer-events-auto"
                                whileHover={{ scale: 1.05 }}
                                animate={{
                                    opacity: isSelected ? 1 : 0.6,
                                    filter: `blur(${Math.abs(index - (selectedIndex - 1)) * 2}px)`,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={profileIcon}
                                    alt={install.name}
                                    className={`transition-all duration-300 ${isSelected ? "w-24 h-24" : "w-16 h-16"}`}
                                />
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>

            {/* selected installation info + buttons */}
            <div className="h-52 flex items-start justify-center mt-4">
            {selectedInstallation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-1"
                >
                    <h3 className="text-xl text-white/70 tracking-0.02">
                        {selectedInstallation.displayName || selectedInstallation.name}
                    </h3>
                    <h5 className="text-sm text-white/50 tracking-0.02">
                        {selectedInstallation.mcVersion} • {selectedInstallation.modLoader}
                    </h5>
                    <div className="flex flex-col items-center gap-2 mt-4 w-48">
                        <PillButton color="orange" className="w-full self-stretch text-center pointer-events-auto">Play</PillButton>
                        <div className="flex gap-2 w-full">
                            <PillButton  color="orange" className="flex-1 flex items-center justify-center pointer-events-auto"><Pencil size={14} /></PillButton>
                            <PillButton  color="red" className="flex-1 flex items-center justify-center pointer-events-auto" onClick={delete_installation}><Trash2 size={14} /></PillButton>
                        </div>
                    </div>
                </motion.div>
            )}
            </div>

            <NewInstallationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={(data) => console.log("create:", data)}
            />
        </div>
    );
}

export default InstallationCarousel;
