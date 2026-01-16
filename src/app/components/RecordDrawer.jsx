import { format, parseISO } from "date-fns";
import { Drawer } from "vaul";
import * as Tabs from "@radix-ui/react-tabs";
import { useI18n } from "../i18n/i18n";

const formatValue = (value) => {
    if (value === null || value === undefined) return "-";
    if (value instanceof Date) return format(value, "yyyy-MM-dd HH:mm");
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
            return format(parseISO(value), "yyyy-MM-dd HH:mm");
        } catch {
            return value;
        }
    }
    return String(value);
};

export function RecordDrawer({ open, onOpenChange, title, columns, item, linkedContent, historyFields, onEdit }) {
    const { t } = useI18n();

    if (!item) return null;

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-gradient-to-br from-slate-900/60 to-indigo-900/40 backdrop-blur-sm" />
                <Drawer.Content className="glass fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-visible shadow-2xl">
                    <div className="flex h-full flex-col">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("drawer.detailsLabel")}</p>
                                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                                </div>
                                {onEdit ? (
                                    <button
                                        type="button"
                                        onClick={onEdit}
                                        className="group rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:shadow-md hover:text-blue-700"
                                    >
                                        {t("common.edit")}
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <Tabs.Root defaultValue="details" className="flex h-full flex-col overflow-visible">
                            <Tabs.List className="flex gap-2 border-b border-slate-200 px-6 py-3 text-sm font-semibold text-slate-500">
                                <Tabs.Trigger value="details" className="rounded-lg px-3 py-1 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    {t("drawer.detailsTab")}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="linked" className="rounded-lg px-3 py-1 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    {t("drawer.linkedTab")}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="history" className="rounded-lg px-3 py-1 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    {t("drawer.historyTab")}
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="details" className="flex-1 overflow-y-auto px-6 py-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {columns.map((col) => (
                                        <div key={col.key} className="group rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:from-blue-50 hover:to-cyan-50 hover:shadow-md">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{col.label}</div>
                                            <div className="mt-1 text-sm font-medium text-slate-700">{formatValue(item[col.key])}</div>
                                        </div>
                                    ))}
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="linked" className="flex-1 overflow-visible px-6 py-5">
                                {linkedContent || (
                                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                                        {t("drawer.noLinked")}
                                    </div>
                                )}
                            </Tabs.Content>

                            <Tabs.Content value="history" className="flex-1 overflow-y-auto px-6 py-5">
                                {historyFields?.length ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {historyFields.map((field) => (
                                            <div key={field.label} className="group rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:from-purple-50 hover:to-pink-50 hover:shadow-md">
                                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</div>
                                                <div className="mt-1 text-sm font-medium text-slate-700">{formatValue(field.value)}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                                        {t("drawer.noHistory")}
                                    </div>
                                )}
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
