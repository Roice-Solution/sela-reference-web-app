import { useId, useMemo, useState, useEffect } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
import { SearchableSelect } from "../ui/SearchableSelect";
export function UserAccessFormDialog({ open, onOpenChange, onSave, mode, initialData, }) {
    const { t } = useI18n();
    const formId = useId();
    const [formData, setFormData] = useState({
        user_id: "",
        role: "viewer",
    });
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(initialData);
        }
        else {
            setFormData({
                user_id: "",
                role: "viewer",
            });
        }
    }, [mode, initialData, open]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    const roleOptions = useMemo(
        () => [
            { value: "admin", label: t("forms.userAccess.roleAdmin") },
            { value: "editor", label: t("forms.userAccess.roleEditor") },
            { value: "viewer", label: t("forms.userAccess.roleViewer") },
        ],
        [t]
    );
    const isDrawer = mode === "edit";
    if (!open) {
        return null;
    }
    return (
        <ModalShell
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "add" ? t("forms.userAccess.titleAdd") : t("forms.userAccess.titleEdit")}
            description={mode === "add" ? t("forms.userAccess.subtitleAdd") : t("forms.userAccess.subtitleEdit")}
            size="sm"
            align={isDrawer ? "right" : "center"}
            footer={
                <>
                    <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                        {t("common.cancel")}
                    </button>
                    <button type="submit" form={formId} className="btn-primary">
                        {mode === "add" ? t("forms.userAccess.add") : t("common.saveChanges")}
                    </button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">{t("forms.userAccess.userId")}</label>
              <input id="user_id" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} required disabled={mode === "edit"} placeholder={t("forms.userAccess.userIdPlaceholder")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand disabled:bg-gray-100"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">{t("forms.userAccess.role")}</label>
              <SearchableSelect
                id="role"
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value })}
                options={roleOptions}
                placeholder={t("forms.userAccess.role")}
                emptyText={t("common.noResults")}
              />
            </div>
            </form>
        </ModalShell>
    );
}
