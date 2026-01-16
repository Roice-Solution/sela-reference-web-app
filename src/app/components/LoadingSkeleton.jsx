export function LoadingSkeleton({ type = "table", rows = 5 }) {
    if (type === "table") {
        return (
            <div className="space-y-3 p-4">
                {/* Header skeleton */}
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="shimmer h-8 rounded-lg" />
                    ))}
                </div>
                {/* Row skeletons */}
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, j) => (
                            <div key={j} className="shimmer h-12 rounded-lg" />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (type === "card") {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="shimmer mb-4 h-14 w-14 rounded-2xl" />
                        <div className="shimmer mb-2 h-10 w-20 rounded-lg" />
                        <div className="shimmer h-4 w-32 rounded-lg" />
                        <div className="shimmer mt-4 h-6 w-16 rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === "list") {
        return (
            <div className="space-y-4">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="shimmer mb-2 h-6 w-3/4 rounded-lg" />
                        <div className="shimmer h-4 w-full rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    // Default skeleton
    return (
        <div className="space-y-4">
            <div className="shimmer h-8 w-64 rounded-lg" />
            <div className="shimmer h-64 w-full rounded-xl" />
        </div>
    );
}

// KPI Card Skeleton
export function KPICardSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                        <div className="shimmer h-14 w-14 rounded-2xl" />
                        <div className="space-y-2">
                            <div className="shimmer h-10 w-24 rounded-lg" />
                            <div className="shimmer h-4 w-32 rounded-lg" />
                        </div>
                        <div className="shimmer h-6 w-20 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Work Area Card Skeleton
export function WorkAreaCardSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                        <div className="shimmer h-1.5 w-16 rounded-full" />
                        <div className="space-y-3">
                            <div className="shimmer h-7 w-40 rounded-lg" />
                            <div className="shimmer h-4 w-full rounded-lg" />
                            <div className="shimmer h-4 w-3/4 rounded-lg" />
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="shimmer h-3 w-24 rounded-lg" />
                            <div className="shimmer h-3 w-32 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
