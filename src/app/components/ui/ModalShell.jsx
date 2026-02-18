import * as Dialog from "@radix-ui/react-dialog";

export function ModalShell({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    size = "lg",
    align = "center",
}) {
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl min-h-[40vh] max-h-[90vh]",
        xl: "max-w-4xl",
    };
    const alignmentClasses = align === "right" ? "items-stretch justify-end" : "items-center justify-center";
    const contentClasses =
        align === "right"
            ? "h-full rounded-none"
            : "rounded-2xl";
    const contentPadding = align === "right" ? "p-0" : "p-4";

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content
                    className={`fixed inset-0 z-50 flex ${alignmentClasses} ${contentPadding}`}
                >
                    <div className={`flex min-h-0 w-full flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl ${sizeClasses[size] || sizeClasses.lg} ${contentClasses}`}>
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-8 py-5">
                            <div>
                                <Dialog.Title className="text-lg font-semibold text-slate-900">{title}</Dialog.Title>
                                {description ? (
                                    <Dialog.Description className="mt-1 text-sm text-slate-600">
                                        {description}
                                    </Dialog.Description>
                                ) : null}
                            </div>
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                                    aria-label="Close"
                                >
                                    Close
                                </button>
                            </Dialog.Close>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">{children}</div>
                        {footer ? (
                            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-8 py-5">
                                {footer}
                            </div>
                        ) : null}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
