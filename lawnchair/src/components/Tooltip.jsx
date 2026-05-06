export default function Tooltip({ children, text }) {

    
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-black/90 border border-white/10 text-white/60 text-xs hidden group-hover:block">
                {text}
            </div>
        </div>
    );
}