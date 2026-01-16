import { useId, useMemo, useState, useEffect } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
import { SearchableSelect } from "../ui/SearchableSelect";
export function MasterAgentFormDialog({ open, onOpenChange, onSave, mode, initialData, }) {
    const { t } = useI18n();
    const formId = useId();
    const [formData, setFormData] = useState({
        master_agent_code: "",
        full_agent_name: "",
        license_owner_name: "",
        license_owner_id: "",
        license_number: "",
        license_owner_mobile_number: "",
        license_owner_phone: "",
        license_owner_email: "",
        comments: "",
        business_cat: "Individual",
        agent_type: "Agent",
        agent_start_date: "",
        agent_end_date: "",
        role: "",
        supervisor_name: "",
        supervisor_id_number: "",
        agent_status: "active",
    });
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(initialData);
        }
        else {
            setFormData({
                master_agent_code: "",
                full_agent_name: "",
                license_owner_name: "",
                license_owner_id: "",
                license_number: "",
                license_owner_mobile_number: "",
                license_owner_phone: "",
                license_owner_email: "",
                comments: "",
                business_cat: "Individual",
                agent_type: "Agent",
                agent_start_date: "",
                agent_end_date: "",
                role: "",
                supervisor_name: "",
                supervisor_id_number: "",
                agent_status: "active",
            });
        }
    }, [mode, initialData, open]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    const statusOptions = useMemo(
        () => [
            { value: "active", label: t("common.active") },
            { value: "inactive", label: t("common.inactive") },
        ],
        [t]
    );
    const businessCategoryOptions = useMemo(
        () => [
            { value: "Individual", label: t("forms.masterAgent.businessCatIndividual") },
            { value: "Corporate", label: t("forms.masterAgent.businessCatCorporate") },
        ],
        [t]
    );
    const agentTypeOptions = useMemo(
        () => [
            { value: "Agent", label: t("forms.masterAgent.agentTypeAgent") },
            { value: "Broker", label: t("forms.masterAgent.agentTypeBroker") },
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
            title={mode === "add" ? t("forms.masterAgent.titleAdd") : t("forms.masterAgent.titleEdit")}
            description={mode === "add" ? t("forms.masterAgent.subtitleAdd") : t("forms.masterAgent.subtitleEdit")}
            size="xl"
            align={isDrawer ? "right" : "center"}
            footer={
                <>
                    <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                        {t("common.cancel")}
                    </button>
                    <button type="submit" form={formId} className="btn-primary">
                        {mode === "add" ? t("forms.masterAgent.add") : t("common.saveChanges")}
                    </button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
              {mode === "edit" ? (<div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="master_agent_code" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.agentCode")}</label>
                    <input id="master_agent_code" value={formData.master_agent_code} onChange={(e) => setFormData({ ...formData, master_agent_code: e.target.value })} required disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand disabled:bg-gray-100"/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="agent_status" className="text-sm font-medium text-gray-700">{t("common.status")}</label>
                    <SearchableSelect
                      id="agent_status"
                      value={formData.agent_status}
                      onChange={(value) => setFormData({ ...formData, agent_status: value })}
                      options={statusOptions}
                      placeholder={t("common.status")}
                      emptyText={t("common.noResults")}
                    />
                  </div>
                </div>) : (<div className="space-y-2">
                  <label htmlFor="agent_status" className="text-sm font-medium text-gray-700">{t("common.status")}</label>
                  <SearchableSelect
                    id="agent_status"
                    value={formData.agent_status}
                    onChange={(value) => setFormData({ ...formData, agent_status: value })}
                    options={statusOptions}
                    placeholder={t("common.status")}
                    emptyText={t("common.noResults")}
                  />
                </div>)}

              <div className="space-y-2">
                <label htmlFor="full_agent_name" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.fullName")}</label>
                <input id="full_agent_name" value={formData.full_agent_name} onChange={(e) => setFormData({ ...formData, full_agent_name: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="license_owner_name" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.licenseOwnerName")}</label>
                  <input id="license_owner_name" value={formData.license_owner_name} onChange={(e) => setFormData({ ...formData, license_owner_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="license_owner_id" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.licenseOwnerId")}</label>
                  <input id="license_owner_id" value={formData.license_owner_id} onChange={(e) => setFormData({ ...formData, license_owner_id: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="license_number" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.licenseNumber")}</label>
                <input id="license_number" value={formData.license_number} onChange={(e) => setFormData({ ...formData, license_number: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="license_owner_mobile_number" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.mobileNumber")}</label>
                  <input id="license_owner_mobile_number" value={formData.license_owner_mobile_number} onChange={(e) => setFormData({ ...formData, license_owner_mobile_number: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="license_owner_phone" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.phoneNumber")}</label>
                  <input id="license_owner_phone" value={formData.license_owner_phone} onChange={(e) => setFormData({ ...formData, license_owner_phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="license_owner_email" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.email")}</label>
                <input id="license_owner_email" type="email" value={formData.license_owner_email} onChange={(e) => setFormData({ ...formData, license_owner_email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="business_cat" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.businessCategory")}</label>
                  <SearchableSelect
                    id="business_cat"
                    value={formData.business_cat}
                    onChange={(value) => setFormData({ ...formData, business_cat: value })}
                    options={businessCategoryOptions}
                    placeholder={t("forms.masterAgent.businessCategory")}
                    emptyText={t("common.noResults")}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="agent_type" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.agentType")}</label>
                  <SearchableSelect
                    id="agent_type"
                    value={formData.agent_type}
                    onChange={(value) => setFormData({ ...formData, agent_type: value })}
                    options={agentTypeOptions}
                    placeholder={t("forms.masterAgent.agentType")}
                    emptyText={t("common.noResults")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="agent_start_date" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.startDate")}</label>
                  <input id="agent_start_date" type="date" value={formData.agent_start_date} onChange={(e) => setFormData({ ...formData, agent_start_date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="agent_end_date" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.endDate")}</label>
                  <input id="agent_end_date" type="date" value={formData.agent_end_date} onChange={(e) => setFormData({ ...formData, agent_end_date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.role")}</label>
                <input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="supervisor_name" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.supervisorName")}</label>
                  <input id="supervisor_name" value={formData.supervisor_name} onChange={(e) => setFormData({ ...formData, supervisor_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="supervisor_id_number" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.supervisorId")}</label>
                  <input id="supervisor_id_number" value={formData.supervisor_id_number} onChange={(e) => setFormData({ ...formData, supervisor_id_number: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="comments" className="text-sm font-medium text-gray-700">{t("forms.masterAgent.comments")}</label>
                <textarea id="comments" value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>
                </div>
              </div>
            </form>
        </ModalShell>
    );
}
