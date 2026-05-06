
// navbar button component :-)




import { motion } from "framer-motion";

function NavButton({ label, to, onClick, active }) {
    return (
        <button
            className="relative px-4 py-1 cursor-pointer bg-transparent"
            onClick={() => onClick(to)}
        >
            {active && (
                <motion.div
                    layoutId="nav-indicator"
                    className="text-white/60 hover:text-white bg-transparent cursor-pointer text-sm transition-colors duration-300 tracking-[-0.02em] inset-0 rounded-md border border-white/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
            <span className={`relative text-sm tracking-[-0.02em] ${active ? "text-white/90" : "text-white/50"}`}>
                {label}
            </span>
        </button>
    );
}

export default NavButton;