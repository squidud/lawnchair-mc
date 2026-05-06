import { useState } from "react";
import "./App.css";

// components
import NavButton from "./components/NavButton";

// pages
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Settings from "./pages/Settings";

//other bs
import { InstallationsProvider } from "./context/InstallationsContext";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  
  const [page, setPage] = useState("home");
  
  return (
    <InstallationsProvider>
      <main className="w-screen h-screen bg-black flex flex-col tracking-[-0.02em]">
        {/* navbar stuff */}
        <nav className="flex gap-8 px-8 py-4 justify-evenly">
          <NavButton label="Home" to="home" onClick={setPage} active={page === "home"} />
          <NavButton label="Browse" to="browse" onClick={setPage} active={page === "browse"} />
          <NavButton label="Settings" to="settings" onClick={setPage} active={page === "settings"} />
        </nav>

        {/* renders page content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {page === "home" && <Home />}
              {page === "browse" && <Browse />}
              {page === "settings" && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </InstallationsProvider>
  );
}

export default App;
