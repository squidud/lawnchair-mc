// small logo :3
import logoSmall from "../assets/logo.png";
function LogoSmall( {label} ) {
    return (
        <div className="flex items-center gap-3 m-12 mt-0">
            <img 
                src={logoSmall}
                alt="Lawnchair Logo"
                className="w-1/10 max-w-lg opacity-90 animate-fade-in"
            />
            <div className="text-white/90 text-5xl font-bold tracking-[-0.02em]">
                {label}
            </div>
        </div>
    );
}

export default LogoSmall;
