import { useEffect, useId, useState } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
import { SearchableSelect } from "../ui/SearchableSelect";

export function AgentCommissionMasterFormDialog({
    open,
    onOpenChange,
    onSave,
    onDeleteTier,
    mode,
    initialData,
    companies,
    masterAgents,
    masterProducts,
}) {
    const { t } = useI18n();
    const formId = useId();
    const tierFormId = useId();
    const [formData, setFormData] = useState({
        company_code: "",
        master_agent_code: "",
        master_product_code: "",
        one_time_commission_type: "percent",
        one_time_commission_value: "",
        use_one_time_tiers: false,
        ongoing_commission_percent: "",
        start_date: "",
        record_type: "agent",
        agreement_status: "active",
        comments: "",
    });
    const [isTierListDialogOpen, setIsTierListDialogOpen] = useState(false);
    const [isAddTierDialogOpen, setIsAddTierDialogOpen] = useState(false);
    const [deletingTierIds, setDeletingTierIds] = useState([]);
    const [editingTierIndex, setEditingTierIndex] = useState(null);
    const [tierListError, setTierListError] = useState("");
    const [tierChangesPendingSave, setTierChangesPendingSave] = useState(false);
    const [tierRows, setTierRows] = useState([]);
    const [tierDraft, setTierDraft] = useState({
        tier_sequence_number: "",
        from_amount: "",
        to_amount: "",
        one_time_commission: "",
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                company_code: initialData.company_code ?? "",
                master_agent_code: initialData.master_agent_code ?? "",
                master_product_code: initialData.master_product_code ?? "",
                one_time_commission_type: initialData.one_time_commission_type ?? "percent",
                one_time_commission_value:
                    initialData.one_time_commission_value ?? initialData.one_time_commission_value === 0
                        ? String(initialData.one_time_commission_value)
                        : "",
                use_one_time_tiers: Boolean(initialData.use_one_time_tiers),
                ongoing_commission_percent:
                    initialData.ongoing_commission_percent ?? initialData.ongoing_commission_percent === 0
                        ? String(initialData.ongoing_commission_percent)
                        : "",
                start_date: initialData.start_date ?? "",
                record_type: initialData.record_type ?? "agent",
                agreement_status: initialData.agreement_status ?? "active",
                comments: initialData.comments ?? "",
            });
            setTierRows(
                (initialData.tiers || []).map((tier) => ({
                    id: tier.id,
                    tier_sequence_number: tier.tier_sequence_number ?? "",
                    from_amount: tier.from_amount ?? "",
                    to_amount: tier.to_amount ?? "",
                    one_time_commission: tier.one_time_commission ?? "",
                }))
            );
            setTierDraft({
                tier_sequence_number: "",
                from_amount: "",
                to_amount: "",
                one_time_commission: "",
            });
            setIsTierListDialogOpen(false);
            setIsAddTierDialogOpen(false);
            setDeletingTierIds([]);
            setEditingTierIndex(null);
            setTierListError("");
            setTierChangesPendingSave(false);
            return;
        }

        setFormData({
            company_code: "",
            master_agent_code: "",
            master_product_code: "",
            one_time_commission_type: "percent",
            one_time_commission_value: "",
            use_one_time_tiers: false,
            ongoing_commission_percent: "",
            start_date: "",
            record_type: "agent",
            agreement_status: "active",
            comments: "",
        });
        setTierRows([]);
        setTierDraft({
            tier_sequence_number: "",
            from_amount: "",
            to_amount: "",
            one_time_commission: "",
        });
        setIsTierListDialogOpen(false);
        setIsAddTierDialogOpen(false);
        setDeletingTierIds([]);
        setEditingTierIndex(null);
        setTierListError("");
        setTierChangesPendingSave(false);
    }, [mode, initialData, open]);

    const companyOptions = companies.map((company) => ({
        value: company.company_code,
        label: company.company_name_en || company.company_name || company.company_code,
        subLabel: company.company_code,
        searchValue: `${company.company_name_en || ""} ${company.company_name || ""} ${company.company_code || ""}`.trim(),
    }));

    const masterAgentOptions = masterAgents.map((agent) => ({
        value: agent.master_agent_code,
        label: agent.full_agent_name || agent.master_agent_code,
        subLabel: agent.master_agent_code,
        searchValue: `${agent.full_agent_name || ""} ${agent.master_agent_code || ""}`.trim(),
    }));

    const masterProductOptions = masterProducts.map((product) => ({
        value: product.master_product_code,
        label: product.master_product_name || product.master_product_code,
        subLabel: product.master_product_code,
        searchValue: `${product.master_product_name || ""} ${product.master_product_code || ""}`.trim(),
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            ...formData,
            one_time_commission_value:
                formData.one_time_commission_value === "" ? null : Number(formData.one_time_commission_value),
            ongoing_commission_percent:
                formData.ongoing_commission_percent === "" ? null : Number(formData.ongoing_commission_percent),
            _one_time_tiers: formData.use_one_time_tiers
                ? tierRows.map((tier) => ({
                      tier_sequence_number: Number(tier.tier_sequence_number),
                      from_amount: Number(tier.from_amount),
                      to_amount: Number(tier.to_amount),
                      one_time_commission: Number(tier.one_time_commission),
                  }))
                : [],
        });
    };

    const needsOneTimeValue = !formData.use_one_time_tiers;
    const isPercentCommission = formData.one_time_commission_type === "percent";
    const tierOneTimeLabel = isPercentCommission
        ? t("forms.agentCommissionMaster.oneTimeCommissionPercent")
        : t("forms.agentCommissionMaster.oneTimeCommissionValue");
    const tierOneTimePlaceholder = isPercentCommission
        ? t("forms.agentCommissionMaster.oneTimeCommissionPercentPlaceholder")
        : t("forms.agentCommissionMaster.oneTimeCommissionValuePlaceholder");
    const isSaveDisabled =
        !formData.company_code ||
        !formData.master_agent_code ||
        !formData.master_product_code ||
        !formData.one_time_commission_type ||
        (needsOneTimeValue && formData.one_time_commission_value === "") ||
        !formData.record_type ||
        !formData.agreement_status;

    const addTierDisabled =
        tierDraft.tier_sequence_number === "" ||
        tierDraft.from_amount === "" ||
        tierDraft.to_amount === "" ||
        tierDraft.one_time_commission === "";
    const previousTier =
        editingTierIndex !== null
            ? tierRows[editingTierIndex - 1]
            : tierRows[tierRows.length - 1];
    const previousToAmount =
        previousTier?.to_amount ?? previousTier?.to_amount === 0
            ? Number(previousTier.to_amount)
            : null;
    const isTierFromAmountInvalid =
        previousToAmount !== null &&
        tierDraft.from_amount !== "" &&
        Number(tierDraft.from_amount) < previousToAmount;
    const isTierToAmountInvalid =
        tierDraft.from_amount !== "" &&
        tierDraft.to_amount !== "" &&
        Number(tierDraft.to_amount) < Number(tierDraft.from_amount);
    const isTierSaveDisabled = addTierDisabled || isTierFromAmountInvalid || isTierToAmountInvalid;

    const handleSaveTier = (event) => {
        event.preventDefault();
        if (isTierSaveDisabled) return;
        const normalizedTier = {
            tier_sequence_number: Number(tierDraft.tier_sequence_number),
            from_amount: Number(tierDraft.from_amount),
            to_amount: Number(tierDraft.to_amount),
            one_time_commission: Number(tierDraft.one_time_commission),
        };
        if (editingTierIndex !== null) {
            setTierRows((prev) =>
                prev.map((tier, index) =>
                    index === editingTierIndex
                        ? {
                              ...tier,
                              ...normalizedTier,
                          }
                        : tier
                )
            );
            setTierChangesPendingSave(true);
        } else {
            setTierRows((prev) => [...prev, normalizedTier]);
            setTierChangesPendingSave(true);
        }
        setTierListError("");
        setTierDraft({
            tier_sequence_number: "",
            from_amount: "",
            to_amount: "",
            one_time_commission: "",
        });
        setEditingTierIndex(null);
        setIsAddTierDialogOpen(false);
        setIsTierListDialogOpen(true);
    };

    const handleDeleteTier = async (tier, index) => {
        if (mode === "edit" && tier?.id && onDeleteTier) {
            setDeletingTierIds((prev) => [...prev, tier.id]);
            try {
                await onDeleteTier(tier.id);
                setTierRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
                setTierChangesPendingSave(true);
            } finally {
                setDeletingTierIds((prev) => prev.filter((id) => id !== tier.id));
            }
            return;
        }
        setTierRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
        setTierChangesPendingSave(true);
    };

    const handleEditTier = (tier, index) => {
        setTierDraft({
            tier_sequence_number: tier.tier_sequence_number ?? "",
            from_amount: tier.from_amount ?? "",
            to_amount: tier.to_amount ?? "",
            one_time_commission: tier.one_time_commission ?? "",
        });
        setEditingTierIndex(index);
        setIsTierListDialogOpen(false);
        setIsAddTierDialogOpen(true);
    };

    const handleCommissionSubmit = (event) => {
        event.preventDefault();
        if (formData.use_one_time_tiers && tierRows.length === 0) {
            setTierListError(t("forms.agentCommissionMaster.tierRequiredError"));
            return;
        }
        setTierListError("");
        handleSubmit(event);
        setTierChangesPendingSave(false);
    };
    const isDrawer = mode === "edit";
    if (!open) return null;

    return (
        <>
            <ModalShell
                open={open}
                onOpenChange={onOpenChange}
                title={mode === "add" ? t("forms.agentCommissionMaster.titleAdd") : t("forms.agentCommissionMaster.titleEdit")}
                description={mode === "add" ? t("forms.agentCommissionMaster.subtitleAdd") : t("forms.agentCommissionMaster.subtitleEdit")}
                size="lg"
                align={isDrawer ? "right" : "center"}
                footer={
                    <>
                        <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                            {t("common.cancel")}
                        </button>
                        <button type="submit" form={formId} disabled={isSaveDisabled} className="btn-primary disabled:cursor-not-allowed">
                            {mode === "add" ? t("forms.agentCommissionMaster.add") : t("common.saveChanges")}
                        </button>
                    </>
                }
            >
                <form id={formId} onSubmit={handleCommissionSubmit} className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.company")}</label>
                        <SearchableSelect
                            value={formData.company_code}
                            onChange={(value) => setFormData({ ...formData, company_code: value })}
                            options={companyOptions}
                            placeholder={t("forms.agentCommissionMaster.selectCompany")}
                            emptyText={t("common.noResults")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.masterAgent")}</label>
                        <SearchableSelect
                            value={formData.master_agent_code}
                            onChange={(value) => setFormData({ ...formData, master_agent_code: value })}
                            options={masterAgentOptions}
                            placeholder={t("forms.agentCommissionMaster.selectAgent")}
                            emptyText={t("common.noResults")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.masterProduct")}</label>
                        <SearchableSelect
                            value={formData.master_product_code}
                            onChange={(value) => setFormData({ ...formData, master_product_code: value })}
                            options={masterProductOptions}
                            placeholder={t("forms.agentCommissionMaster.selectProduct")}
                            emptyText={t("common.noResults")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="one_time_commission_type" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.oneTimeCommissionType")}</label>
                        <select
                            id="one_time_commission_type"
                            value={formData.one_time_commission_type}
                            onChange={(event) => setFormData({ ...formData, one_time_commission_type: event.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        >
                            <option value="percent">{t("forms.agentCommissionMaster.commissionTypePercent")}</option>
                            <option value="fixed">{t("forms.agentCommissionMaster.commissionTypeFixed")}</option>
                        </select>
                    </div>

                    {!formData.use_one_time_tiers ? (
                        <div className="space-y-2">
                            <label htmlFor="one_time_commission_value" className="block text-sm font-medium text-gray-700">
                                {isPercentCommission
                                    ? t("forms.agentCommissionMaster.oneTimeCommissionPercent")
                                    : t("forms.agentCommissionMaster.oneTimeCommissionValue")}
                            </label>
                            <input
                                id="one_time_commission_value"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.one_time_commission_value}
                                onChange={(event) => setFormData({ ...formData, one_time_commission_value: event.target.value })}
                                placeholder={
                                    isPercentCommission
                                        ? t("forms.agentCommissionMaster.oneTimeCommissionPercentPlaceholder")
                                        : t("forms.agentCommissionMaster.oneTimeCommissionValuePlaceholder")
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                            />
                        </div>
                    ) : null}

                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={formData.use_one_time_tiers}
                            onChange={(event) => {
                                const checked = event.target.checked;
                                setFormData({ ...formData, use_one_time_tiers: checked });
                                if (checked) {
                                    setIsTierListDialogOpen(true);
                                } else {
                                    setTierListError("");
                                }
                            }}
                            className="h-4 w-4 rounded border-slate-300"
                        />
                        {t("forms.agentCommissionMaster.useOneTimeTiers")}
                    </label>
                    {formData.use_one_time_tiers ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsTierListDialogOpen(true)}
                                className="w-fit rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                            >
                                {t("forms.agentCommissionMaster.configureTiers", { count: tierRows.length })}
                            </button>
                            {tierListError ? (
                                <p className="text-xs text-rose-600">{tierListError}</p>
                            ) : null}
                            {tierChangesPendingSave ? (
                                <p className="text-xs text-amber-700">{t("forms.agentCommissionMaster.saveCommissionAfterTierEdit")}</p>
                            ) : null}
                            {tierRows.length ? (
                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                    <table className="w-full min-w-[620px] text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                <th className="px-3 py-2 text-start">{t("forms.agentCommissionTier.tierSequenceNumber")}</th>
                                                <th className="px-3 py-2 text-start">{t("forms.agentCommissionTier.fromAmount")}</th>
                                                <th className="px-3 py-2 text-start">{t("forms.agentCommissionTier.toAmount")}</th>
                                                <th className="px-3 py-2 text-start">{t("forms.agentCommissionTier.oneTimeCommission")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tierRows
                                                .slice()
                                                .sort((a, b) => (a.tier_sequence_number || 0) - (b.tier_sequence_number || 0))
                                                .map((tier, index) => (
                                                    <tr key={`${tier.id || "tier"}-${index}`} className="border-b border-slate-100 last:border-b-0">
                                                        <td className="px-3 py-2 text-slate-700">{tier.tier_sequence_number}</td>
                                                        <td className="px-3 py-2 text-slate-700">{tier.from_amount}</td>
                                                        <td className="px-3 py-2 text-slate-700">{tier.to_amount}</td>
                                                        <td className="px-3 py-2 text-slate-700">{tier.one_time_commission}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    <div className="space-y-2">
                        <label htmlFor="ongoing_commission_percent" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.ongoingCommissionPercent")}</label>
                        <input
                            id="ongoing_commission_percent"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={formData.ongoing_commission_percent}
                            onChange={(event) => setFormData({ ...formData, ongoing_commission_percent: event.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.startDate")}</label>
                        <input
                            id="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={(event) => setFormData({ ...formData, start_date: event.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="record_type" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.recordType")}</label>
                            <select
                                id="record_type"
                                value={formData.record_type}
                                onChange={(event) => setFormData({ ...formData, record_type: event.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                            >
                                <option value="agent">{t("forms.agentCommissionMaster.recordTypeAgent")}</option>
                                <option value="broker">{t("forms.agentCommissionMaster.recordTypeBroker")}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="agreement_status" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.agreementStatus")}</label>
                            <select
                                id="agreement_status"
                                value={formData.agreement_status}
                                onChange={(event) => setFormData({ ...formData, agreement_status: event.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                            >
                                <option value="active">{t("forms.agentCommissionMaster.statusActive")}</option>
                                <option value="not_active">{t("forms.agentCommissionMaster.statusNotActive")}</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.comments")}</label>
                        <textarea
                            id="comments"
                            rows={3}
                            value={formData.comments}
                            onChange={(event) => setFormData({ ...formData, comments: event.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                    </div>
                </form>
            </ModalShell>

            <ModalShell
                open={isTierListDialogOpen}
                onOpenChange={setIsTierListDialogOpen}
                title={t("forms.agentCommissionMaster.tierDialogTitle")}
                description={t("forms.agentCommissionMaster.tierDialogDescription")}
                size="lg"
                align="center"
                footer={
                    <>
                        <button type="button" onClick={() => setIsTierListDialogOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                            {t("common.cancel")}
                        </button>
                        <button type="button" onClick={() => setIsTierListDialogOpen(false)} className="btn-primary">
                            {t("common.saveChanges")}
                        </button>
                    </>
                }
            >
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingTierIndex(null);
                            setTierDraft({
                                tier_sequence_number: "",
                                from_amount: "",
                                to_amount: "",
                                one_time_commission: "",
                            });
                            setIsTierListDialogOpen(false);
                            setIsAddTierDialogOpen(true);
                        }}
                        className="w-fit rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                    >
                        {t("forms.agentCommissionMaster.addNewTier")}
                    </button>
                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                        {tierRows.length ? (
                            tierRows.map((tier, index) => (
                                <div key={`${tier.id || "new"}-${index}`} className="flex items-center justify-between px-3 py-2 text-sm text-slate-700">
                                    <span>#{tier.tier_sequence_number} | {tier.from_amount} - {tier.to_amount} | {tier.one_time_commission}</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleEditTier(tier, index)}
                                            className="text-slate-700 hover:text-slate-900"
                                        >
                                            {t("common.edit")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTier(tier, index)}
                                            disabled={Boolean(tier?.id) && deletingTierIds.includes(tier.id)}
                                            className="text-rose-600 hover:text-rose-700"
                                        >
                                            {t("common.delete")}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-3 text-sm text-slate-500">{t("forms.agentCommissionMaster.noTiersAdded")}</div>
                        )}
                    </div>
                </div>
            </ModalShell>

            <ModalShell
                open={isAddTierDialogOpen}
                onOpenChange={setIsAddTierDialogOpen}
                title={editingTierIndex !== null ? t("forms.agentCommissionTier.titleEdit") : t("forms.agentCommissionTier.titleAdd")}
                description={editingTierIndex !== null ? t("forms.agentCommissionTier.subtitleEdit") : t("forms.agentCommissionTier.subtitleAdd")}
                size="lg"
                align="center"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddTierDialogOpen(false);
                                setEditingTierIndex(null);
                            }}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
                        >
                            {t("common.cancel")}
                        </button>
                        <button type="submit" form={tierFormId} disabled={isTierSaveDisabled} className="btn-primary disabled:cursor-not-allowed">
                            {editingTierIndex !== null ? t("common.saveChanges") : t("forms.agentCommissionTier.add")}
                        </button>
                    </>
                }
            >
                <form id={tierFormId} onSubmit={handleSaveTier} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="tier_sequence_number" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionTier.tierSequenceNumber")}</label>
                        <input
                            id="tier_sequence_number"
                            type="number"
                            min="1"
                            value={tierDraft.tier_sequence_number}
                            onChange={(event) => setTierDraft((prev) => ({ ...prev, tier_sequence_number: event.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="from_amount" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionTier.fromAmount")}</label>
                        <input
                            id="from_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={tierDraft.from_amount}
                            onChange={(event) => setTierDraft((prev) => ({ ...prev, from_amount: event.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                        {isTierFromAmountInvalid ? (
                            <p className="text-xs text-rose-600">
                                {t("forms.agentCommissionTier.fromAmountAtLeastPreviousTo")}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="to_amount" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionTier.toAmount")}</label>
                        <input
                            id="to_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={tierDraft.to_amount}
                            onChange={(event) => setTierDraft((prev) => ({ ...prev, to_amount: event.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                        {isTierToAmountInvalid ? (
                            <p className="text-xs text-rose-600">
                                {t("forms.agentCommissionTier.toAmountAtLeastFromAmount")}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="one_time_commission" className="block text-sm font-medium text-gray-700">{tierOneTimeLabel}</label>
                        <input
                            id="one_time_commission"
                            type="number"
                            step="0.01"
                            min="0"
                            value={tierDraft.one_time_commission}
                            onChange={(event) => setTierDraft((prev) => ({ ...prev, one_time_commission: event.target.value }))}
                            placeholder={tierOneTimePlaceholder}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                    </div>
                </form>
            </ModalShell>
        </>
    );
}
