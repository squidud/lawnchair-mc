// components
import ParticleBG from "../components/ParticleBG";
import LogoLarge from "../components/LogoLarge";
import InstallationCarousel from "../components/InstallationCarousel";

function Home() {
    return (
        <div className="w-full h-full relative bg-linear-to-br from-black to-[#1a0401]">
            <ParticleBG />
            <div className="absolute inset-0 flex flex-col items-center pointer-events-none">
                <LogoLarge />
                <div className="flex-1 flex items-center w-full">
                    <InstallationCarousel />
                </div>
                <p className="absolute bottom-4 left-6 text-orange-400/50 text-xs tracking-0.02">
                    v{__APP_VERSION__}
                </p>

            </div>
        </div>
    );
}

export default Home;
