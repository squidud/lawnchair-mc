// components
import Box from "../components/Box";
import LogoSmall from "../components/LogoSmall";
import ParticleBG from "../components/ParticleBG";
import PillButton from "../components/PillButton";

//other bs
import { open } from "@tauri-apps/plugin-dialog";
import { useInstallations } from "../context/InstallationsContext";

function Settings() {
    const { profilesPath, updateProfilesPath } = useInstallations();

    async function pickDirectory() {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Select Profiles Folder",
        });
        if (selected) {
            updateProfilesPath(selected);
        }
    }
  
  return <div className="w-full h-full relative bg-linear-to-br from-black to-[#1a0401]">
    <ParticleBG />
    <div className="absolute inset-0 pointer-events-none">
      <LogoSmall label="Settings" class=""/>
        <Box>
            <div className="text-white/80 pointer-events-auto flex flex-col gap-4">
                <p className="text-white/50 text-lg tracking-0.02">System Options</p>
                <hr className="border-white/20" />
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    <div className="flex items-center gap-4">
                        <span>Profiles Folder:</span>
                        <p className="text-white/70 text-sm">{profilesPath || "No folder selected"}</p>
                    </div>
                    
                    <div className="text-right">
                        <PillButton color="orange" onClick={pickDirectory}>Browse</PillButton>
                    </div>
                    
                </div>

            </div>
        </Box>
    </div>
  </div>
}

export default Settings;


