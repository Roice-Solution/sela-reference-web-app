import { useEffect, useId, useMemo, useState } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
import { SearchableSelect } from "../ui/SearchableSelect";

export function AgentCommissionMasterFormDialog({
    open,
    onOpenChange,
    onSave,
    mode,
    initialData,
    companies,
    masterAgents,
    masterProducts,
    tiers,
    onCreateTier,
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
        start_date: "",
        record_type: "agent",
        agreement_status: "active",
        comments: "",
    });
    const [isTierDialogOpen, setIsTierDialogOpen] = useState(false);
    const [isAddTierDialogOpen, setIsAddTierDialogOpen] = useState(false);
    const [isCreatingTier, setIsCreatingTier] = useState(false);
    const [selectedTierId, setSelectedTierId] = useState("");
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
                start_date: initialData.start_date ?? "",
                record_type: initialData.record_type ?? "agent",
                agreement_status: initialData.agreement_status ?? "active",
                comments: initialData.comments ?? "",
            });
            setSelectedTierId(initialData.tier_id ? String(initialData.tier_id) : "");
            setTierDraft({
                tier_sequence_number: "",
                from_amount: "",
                to_amount: "",
                one_time_commission: "",
            });
            setIsTierDialogOpen(false);
            setIsAddTierDialogOpen(false);
            return;
        }
        setFormData({
            company_code: "",
            master_agent_code: "",
            master_product_code: "",
            one_time_commission_type: "percent",
            one_time_commission_value: "",
            use_one_time_tiers: false,
            start_date: "",
            record_type: "agent",
            agreement_status: "active",
            comments: "",
        });
        setSelectedTierId("");
        setTierDraft({
            tier_sequence_number: "",
            from_amount: "",
            to_amount: "",
            one_time_commission: "",
        });
        setIsTierDialogOpen(false);
        setIsAddTierDialogOpen(false);
    }, [mode, initialData, open]);

    const companyOptions = useMemo(
        () =>
            companies.map((company) => ({
                value: company.company_code,
                label: company.company_name_en || company.company_name || company.company_code,
                subLabel: company.company_code,
                searchValue: `${company.company_name_en || ""} ${company.company_name || ""} ${company.company_code || ""}`.trim(),
            })),
        [companies]
    );
    const masterAgentOptions = useMemo(
        () =>
            masterAgents.map((agent) => ({
                value: agent.master_agent_code,
                label: agent.full_agent_name || agent.master_agent_code,
                subLabel: agent.master_agent_code,
                searchValue: `${agent.full_agent_name || ""} ${agent.master_agent_code || ""}`.trim(),
            })),
        [masterAgents]
    );
    const masterProductOptions = useMemo(
        () =>
            masterProducts.map((product) => ({
                value: product.master_product_code,
                label: product.master_product_name || product.master_product_code,
                subLabel: product.master_product_code,
                searchValue: `${product.master_product_name || ""} ${product.master_product_code || ""}`.trim(),
            })),
        [masterProducts]
    );
    const tierOptions = useMemo(
        () =>
            (tiers || []).map((tier) => ({
                value: String(tier.id),
                label: `#${tier.tier_sequence_number} | ${tier.from_amount} - ${tier.to_amount}`,
                subLabel: `${tier.one_time_commission}`,
                searchValue: `${tier.id} ${tier.tier_sequence_number} ${tier.from_amount} ${tier.to_amount} ${tier.one_time_commission}`,
            })),
        [tiers]
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            ...formData,
            one_time_commission_value:
                formData.one_time_commission_value === "" ? null : Number(formData.one_time_commission_value),
            _selected_tier_id: formData.use_one_time_tiers && selectedTierId ? Number(selectedTierId) : null,
        });
    };

    const needsOneTimeValue = !formData.use_one_time_tiers;
    const isPercentCommission = formData.one_time_commission_type === "percent";
    const isSaveDisabled =
        !formData.company_code ||
        !formData.master_agent_code ||
        !formData.master_product_code ||
        !formData.one_time_commission_type ||
        (needsOneTimeValue && formData.one_time_commission_value === "") ||
        (formData.use_one_time_tiers && !selectedTierId) ||
        !formData.record_type ||
        !formData.agreement_status ||
        !formData.start_date;
    const addTierDisabled =
        tierDraft.tier_sequence_number === "" ||
        tierDraft.from_amount === "" ||
        tierDraft.to_amount === "" ||
        tierDraft.one_time_commission === "";
    const handleAddTierRow = (event) => {
        event.preventDefault();
        if (addTierDisabled) return;
        if (!onCreateTier) return;
        setIsCreatingTier(true);
        Promise.resolve(
            onCreateTier({
                tier_sequence_number: Number(tierDraft.tier_sequence_number),
                from_amount: Number(tierDraft.from_amount),
                to_amount: Number(tierDraft.to_amount),
                one_time_commission: Number(tierDraft.one_time_commission),
            })
        )
            .then((createdTier) => {
                if (createdTier?.id) {
                    setSelectedTierId(String(createdTier.id));
                }
                setTierDraft({
                    tier_sequence_number: "",
                    from_amount: "",
                    to_amount: "",
                    one_time_commission: "",
                });
                setIsAddTierDialogOpen(false);
                setIsTierDialogOpen(true);
            })
            .finally(() => {
                setIsCreatingTier(false);
            });
    };

    const isDrawer = mode === "edit";
    if (!open) {
        return null;
    }

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
                <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={formData.use_one_time_tiers}
                        onChange={(event) => {
                            const checked = event.target.checked;
                            setFormData({ ...formData, use_one_time_tiers: checked });
                            if (checked) {
                                setIsTierDialogOpen(true);
                            } else {
                                setSelectedTierId("");
                            }
                        }}
                        className="h-4 w-4 rounded border-slate-300"
                    />
                    {t("forms.agentCommissionMaster.useOneTimeTiers")}
                </label>
                {formData.use_one_time_tiers ? (
                    <button
                        type="button"
                        onClick={() => setIsTierDialogOpen(true)}
                        className="w-fit rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                    >
                        {t("forms.agentCommissionMaster.configureTiers", { count: selectedTierId ? 1 : 0 })}
                    </button>
                ) : null}

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
                open={isTierDialogOpen}
                onOpenChange={setIsTierDialogOpen}
                title={t("forms.agentCommissionMaster.tierDialogTitle")}
                description={t("forms.agentCommissionMaster.tierDialogDescription")}
                size="lg"
                align="center"
                footer={
                    <>
                        <button type="button" onClick={() => setIsTierDialogOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                            {t("common.cancel")}
                        </button>
                        <button type="button" onClick={() => setIsTierDialogOpen(false)} className="btn-primary">
                            {t("common.saveChanges")}
                        </button>
                    </>
                }
            >
                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionMaster.selectExistingTier")}</label>
                        <SearchableSelect
                            value={selectedTierId}
                            onChange={(value) => setSelectedTierId(value)}
                            options={tierOptions}
                            placeholder={t("forms.agentCommissionMaster.selectTierPlaceholder")}
                            emptyText={t("common.noResults")}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setIsTierDialogOpen(false);
                            setIsAddTierDialogOpen(true);
                        }}
                        className="w-fit rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                    >
                        {t("forms.agentCommissionMaster.addNewTier")}
                    </button>
                </div>
            </ModalShell>

            <ModalShell
                open={isAddTierDialogOpen}
                onOpenChange={setIsAddTierDialogOpen}
                title={t("forms.agentCommissionTier.titleAdd")}
                description={t("forms.agentCommissionTier.subtitleAdd")}
                size="lg"
                align="center"
                footer={
                    <>
                        <button type="button" onClick={() => setIsAddTierDialogOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                            {t("common.cancel")}
                        </button>
                        <button type="submit" form={tierFormId} disabled={addTierDisabled || isCreatingTier} className="btn-primary disabled:cursor-not-allowed">
                            {t("forms.agentCommissionTier.add")}
                        </button>
                    </>
                }
            >
                <form id={tierFormId} onSubmit={handleAddTierRow} className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="one_time_commission" className="block text-sm font-medium text-gray-700">{t("forms.agentCommissionTier.oneTimeCommission")}</label>
                        <input
                            id="one_time_commission"
                            type="number"
                            step="0.01"
                            min="0"
                            value={tierDraft.one_time_commission}
                            onChange={(event) => setTierDraft((prev) => ({ ...prev, one_time_commission: event.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"
                        />
                    </div>
                </form>
            </ModalShell>
        </>
    );
}
