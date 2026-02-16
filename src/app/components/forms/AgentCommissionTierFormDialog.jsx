import { useEffect, useId, useState } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";

export function AgentCommissionTierFormDialog({
    open,
    onOpenChange,
    onSave,
    mode,
    initialData,
}) {
    const { t } = useI18n();
    const formId = useId();
    const [formData, setFormData] = useState({
        tier_sequence_number: "",
        from_amount: "",
        to_amount: "",
        one_time_commission: "",
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                tier_sequence_number: initialData.tier_sequence_number ?? "",
                from_amount: initialData.from_amount ?? "",
                to_amount: initialData.to_amount ?? "",
                one_time_commission: initialData.one_time_commission ?? "",
            });
            return;
        }
        setFormData({
            tier_sequence_number: "",
            from_amount: "",
            to_amount: "",
            one_time_commission: "",
        });
    }, [mode, initialData, open]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            ...formData,
            tier_sequence_number: Number(formData.tier_sequence_number),
            from_amount: Number(formData.from_amount),
            to_amount: Number(formData.to_amount),
            one_time_commission: Number(formData.one_time_commission),
        });
    };

    const isSaveDisabled =
        formData.tier_sequence_number === "" ||
        formData.from_amount === "" ||
        formData.to_amount === "" ||
        formData.one_time_commission === "";

    const isDrawer = mode === "edit";

    if (!open) {
        return null;
    }

    return (
        <ModalShell
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "add" ? t("forms.agentCommissionTier.titleAdd") : t("forms.agentCommissionTier.titleEdit")}
            description={mode === "add" ? t("forms.agentCommissionTier.subtitleAdd") : t("forms.agentCommissionTier.subtitleEdit")}
            size="lg"
            align={isDrawer ? "right" : "center"}
            footer={
                <>
                    <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                        {t("common.cancel")}
                    </button>
                    <button type="submit" form={formId} disabled={isSaveDisabled} className="btn-primary disabled:cursor-not-allowed">
                        {mode === "add" ? t("forms.agentCommissionTier.add") : t("common.saveChanges")}
                    </button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                    <label htmlFor="tier_sequence_number" className="block text-sm font-medium text-gray-700">
                        {t("forms.agentCommissionTier.tierSequenceNumber")}
                    </label>
                    <input
                        id="tier_sequence_number"
                        type="number"
                        min="1"
                        value={formData.tier_sequence_number}
                        onChange={(event) => setFormData({ ...formData, tier_sequence_number: event.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="from_amount" className="block text-sm font-medium text-gray-700">
                        {t("forms.agentCommissionTier.fromAmount")}
                    </label>
                    <input
                        id="from_amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.from_amount}
                        onChange={(event) => setFormData({ ...formData, from_amount: event.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="to_amount" className="block text-sm font-medium text-gray-700">
                        {t("forms.agentCommissionTier.toAmount")}
                    </label>
                    <input
                        id="to_amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.to_amount}
                        onChange={(event) => setFormData({ ...formData, to_amount: event.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="one_time_commission" className="block text-sm font-medium text-gray-700">
                        {t("forms.agentCommissionTier.oneTimeCommission")}
                    </label>
                    <input
                        id="one_time_commission"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.one_time_commission}
                        onChange={(event) => setFormData({ ...formData, one_time_commission: event.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        required
                    />
                </div>
            </form>
        </ModalShell>
    );
}
