// Box component for building section :-o
function Box({ essential, children, className = "", noMargin = false, ...props }) {
    return (
        <div
            className={"border border-orange-200/20 rounded-lg p-6 shadow-lg bg-linear-to-br from-black/50 to-orange-950/50 backdrop-blur-md " + (noMargin ? "" : "m-12 mt-6 ") + className}
            {...props}
        >
            {essential ?? children}
        </div>
    );
}

export default Box;