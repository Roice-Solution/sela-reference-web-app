export function PageHeader({ title, description, actions, align = "left" }) {
    const isCenter = align === "center";
    return (
        <div
            className={`flex flex-col gap-4 ${
                isCenter ? "items-center text-center" : "sm:flex-row sm:items-start sm:justify-between"
            }`}
        >
            <div className={isCenter ? "flex flex-col items-center" : ""}>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
                {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
            </div>
            {actions ? <div className={`flex flex-wrap items-center gap-2 ${isCenter ? "justify-center" : ""}`}>{actions}</div> : null}
        </div>
    );
}
