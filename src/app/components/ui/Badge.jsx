export function Badge({ children, variant = "default", size = "md", className = "" }) {
    const variants = {
        default: "bg-gradient-to-r from-slate-400 to-slate-500",
        blue: "bg-gradient-to-r from-blue-500 to-cyan-500",
        purple: "bg-gradient-to-r from-purple-500 to-pink-500",
        green: "bg-gradient-to-r from-emerald-500 to-teal-500",
        amber: "bg-gradient-to-r from-amber-500 to-orange-500",
        red: "bg-gradient-to-r from-red-500 to-pink-500",
        indigo: "bg-gradient-to-r from-indigo-500 to-purple-500",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
    };

    return (
        <span
            className={`inline-flex items-center rounded-lg font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </span>
    );
}

export function BadgeGroup({ children, spacing = "gap-2", className = "" }) {
    return <div className={`flex flex-wrap items-center ${spacing} ${className}`}>{children}</div>;
}

// Icon Badge with circular background
export function IconBadge({ icon: Icon, variant = "blue", size = "md" }) {
    const variants = {
        blue: "bg-gradient-to-br from-blue-500 to-cyan-500",
        purple: "bg-gradient-to-br from-purple-500 to-pink-500",
        green: "bg-gradient-to-br from-emerald-500 to-teal-500",
        amber: "bg-gradient-to-br from-amber-500 to-orange-500",
    };

    const sizes = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    return (
        <div
            className={`flex items-center justify-center rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3 ${variants[variant]} ${sizes[size]}`}
        >
            <Icon className={`text-white ${iconSizes[size]}`} />
        </div>
    );
}

// Status Badge with pulsing dot
export function StatusBadge({ status, label }) {
    const isActive = status === "active";
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-bold shadow-md ${
                isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
            }`}
        >
            <span className={`h-2 w-2 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-white/70"}`} />
            {label}
        </span>
    );
}
