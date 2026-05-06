// large main logo with text :3
import logoText from "../assets/logo-text.png";
function LogoLarge() {
    return (
        <div className="absolute inset-x-0 top-0 flex justify-center pt-10">
            <img 
                src={logoText}
                alt="Lawnchair Logo"
                className="w-1/2 max-w-lg opacity-90 animate-fade-in"
            />
        </div>
    );
}

export default LogoLarge;
