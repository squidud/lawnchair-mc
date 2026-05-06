export default function PillButton({ onClick, children, className = "", color = "orange", square = false }) {
    const colorMap = {
        orange: "border-orange-200/40 bg-orange-600/10",
        red: "border-red-200/40 bg-red-600/10",
        green: "border-green-200/40 bg-green-600/10",
        blue: "border-blue-200/40 bg-blue-600/10",
    };

    const colors = colorMap[color] || colorMap.orange;

    const baseClassName = `cursor-pointer border ${colors} text-white/70 hover:text-white transition-all duration-300 text-xs tracking-0.02 hover:scale-105 ${
        square ? "p-3 rounded-lg" : "self-start px-6 py-2 rounded-full"
    }`;

    
    return (
        <button
            onClick={onClick}
            className={`${baseClassName} ${className}`}
        >
            {children}
        </button>
    );
}