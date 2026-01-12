import { useEffect, useId, useMemo, useState } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
import { SearchableSelect } from "../ui/SearchableSelect";
export function AgentPerCompanyFormDialog({ open, onOpenChange, onSave, mode, initialData, companies, masterAgents, masterProducts, productsPerCompany, }) {
    const { t } = useI18n();
    const formId = useId();
    const [formData, setFormData] = useState({
        company_code: "",
        master_agent_code: "",
        company_product_code: "",
        master_product_code: "",
        comments: "",
    });
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(initialData);
        }
        else {
            setFormData({
                company_code: "",
                master_agent_code: "",
                company_product_code: "",
                master_product_code: "",
                comments: "",
            });
        }
    }, [mode, initialData, open]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    const isSaveDisabled = !formData.company_code || !formData.master_agent_code || !formData.master_product_code;
    const companyOptions = useMemo(() => companies.map((company) => ({
        value: company.company_code,
        label: company.company_name_en || company.company_name || company.company_code,
        subLabel: company.company_code,
        searchValue: `${company.company_name_en || ""} ${company.company_name || ""} ${company.company_code || ""}`.trim(),
    })), [companies]);
    const masterAgentOptions = useMemo(() => masterAgents.map((agent) => ({
        value: agent.master_agent_code,
        label: agent.full_agent_name || agent.master_agent_code,
        subLabel: agent.master_agent_code,
        searchValue: `${agent.full_agent_name || ""} ${agent.master_agent_code || ""}`.trim(),
    })), [masterAgents]);
    const availableMasterProductCodes = useMemo(() => {
        if (!formData.company_code) {
            return null;
        }
        const codes = new Set();
        (productsPerCompany || []).forEach((item) => {
            if (item.company_code === formData.company_code && item.master_product_code) {
                codes.add(item.master_product_code);
            }
        });
        return codes.size ? codes : null;
    }, [formData.company_code, productsPerCompany]);
    const masterProductOptions = useMemo(() => {
        const filtered = masterProducts.filter((product) => {
            if (!availableMasterProductCodes) return true;
            return availableMasterProductCodes.has(product.master_product_code);
        });
        return filtered.map((product) => ({
            value: product.master_product_code,
            label: product.master_product_name || product.master_product_code,
            subLabel: product.master_product_code,
            searchValue: `${product.master_product_name || ""} ${product.master_product_code || ""}`.trim(),
        }));
    }, [availableMasterProductCodes, masterProducts]);
    useEffect(() => {
        if (!formData.master_product_code) return;
        if (!availableMasterProductCodes) return;
        if (!availableMasterProductCodes.has(formData.master_product_code)) {
            setFormData((prev) => ({ ...prev, master_product_code: "" }));
        }
    }, [availableMasterProductCodes, formData.master_product_code]);
    const isDrawer = mode === "edit";
    if (!open) {
        return null;
    }
    return (
        <ModalShell
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "add" ? t("forms.agentPerCompany.titleAdd") : t("forms.agentPerCompany.titleEdit")}
            description={mode === "add" ? t("forms.agentPerCompany.subtitleAdd") : t("forms.agentPerCompany.subtitleEdit")}
            size="lg"
            align={isDrawer ? "right" : "center"}
            footer={
                <>
                    <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                        {t("common.cancel")}
                    </button>
                    <button type="submit" form={formId} disabled={isSaveDisabled} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {mode === "add" ? t("forms.agentPerCompany.add") : t("common.saveChanges")}
                    </button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="company_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.company")}</label>
              <SearchableSelect id="company_code" value={formData.company_code} onChange={(value) => setFormData({ ...formData, company_code: value })} options={companyOptions} placeholder={t("forms.agentPerCompany.selectCompany")} emptyText={t("common.noResults")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="master_agent_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.masterAgent")}</label>
              <SearchableSelect id="master_agent_code" value={formData.master_agent_code} onChange={(value) => setFormData({ ...formData, master_agent_code: value })} options={masterAgentOptions} placeholder={t("forms.agentPerCompany.selectAgent")} emptyText={t("common.noResults")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="master_product_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.masterProduct")}</label>
              <SearchableSelect id="master_product_code" value={formData.master_product_code} onChange={(value) => setFormData({ ...formData, master_product_code: value })} options={masterProductOptions} placeholder={t("forms.agentPerCompany.selectProduct")} emptyText={t("common.noResults")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="company_product_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.companyProductCode")}</label>
              <input id="company_product_code" value={formData.company_product_code} onChange={(e) => setFormData({ ...formData, company_product_code: e.target.value })} placeholder={t("forms.agentPerCompany.companyProductPlaceholder")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.comments")}</label>
              <textarea id="comments" value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            </form>
        </ModalShell>
    );
}
