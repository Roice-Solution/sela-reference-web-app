import { useId, useMemo, useState, useEffect } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
import { SearchableSelect } from "../ui/SearchableSelect";
export function CompanyFormDialog({ open, onOpenChange, onSave, mode, initialData, }) {
    const { t } = useI18n();
    const formId = useId();
    const [formData, setFormData] = useState({
        company_code: "",
        company_name: "",
        company_name_en: "",
        company_type: "Insurance",
        login_page_url: "",
        login_type: "Basic",
        otp_email: "",
        otp_mobile_number: "",
        user_name: "",
        user_id: "",
        vat_id: "",
        user_name_type: "email",
        password: "",
        status: "active",
    });
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(initialData);
        }
        else {
            setFormData({
                company_code: "",
                company_name: "",
                company_name_en: "",
                company_type: "Insurance",
                login_page_url: "",
                login_type: "Basic",
                otp_email: "",
                otp_mobile_number: "",
                user_name: "",
                user_id: "",
                vat_id: "",
                user_name_type: "email",
                password: "",
                status: "active",
            });
        }
    }, [mode, initialData, open]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    const statusOptions = useMemo(
        () => [
            { value: "Active", label: t("forms.company.statusActive") },
            { value: "Cancelled", label: t("forms.company.statusCancelled") },
        ],
        [t]
    );
    const loginTypeOptions = useMemo(
        () => [
            { value: "SMS", label: t("forms.company.loginTypeBasic") },
            { value: "EMAIL", label: t("forms.company.loginTypeSso") },
            { value: "NONE", label: t("forms.company.loginTypeOauth") },
        ],
        [t]
    );
    const userNameTypeOptions = useMemo(
        () => [
            { value: "ID", label: t("forms.company.userNameTypeEmail") },
            { value: "VATID", label: t("forms.company.userNameTypeUsername") },
            { value: "USER", label: t("forms.company.userNameTypeId") },
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
            title={mode === "add" ? t("forms.company.titleAdd") : t("forms.company.titleEdit")}
            description={mode === "add" ? t("forms.company.subtitleAdd") : t("forms.company.subtitleEdit")}
            size="xl"
            align={isDrawer ? "right" : "center"}
            footer={
                <>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        type="submit"
                        form={formId}
                        className="btn-primary"
                    >
                        {mode === "add" ? t("forms.company.add") : t("common.saveChanges")}
                    </button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "edit" && (<div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="company_code" className="block text-sm font-medium text-gray-700">{t("forms.company.companyCode")}</label>
                    <input id="company_code" value={formData.company_code} onChange={(e) => setFormData({ ...formData, company_code: e.target.value })} required disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand disabled:bg-gray-100"/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">{t("common.status")}</label>
                    <SearchableSelect
                      id="status"
                      value={formData.status}
                      onChange={(value) => setFormData({ ...formData, status: value })}
                      options={statusOptions}
                      placeholder={t("common.status")}
                      emptyText={t("common.noResults")}
                    />
                  </div>
                </div>)}

              <div className="space-y-2">
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">{t("forms.company.companyNameAr")}</label>
                <input id="company_name" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>

              <div className="space-y-2">
                <label htmlFor="company_name_en" className="block text-sm font-medium text-gray-700">{t("forms.company.companyNameEn")}</label>
                <input id="company_name_en" value={formData.company_name_en} onChange={(e) => setFormData({ ...formData, company_name_en: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="company_type" className="block text-sm font-medium text-gray-700">{t("forms.company.companyType")}</label>
                  <input id="company_type" value={formData.company_type} onChange={(e) => setFormData({ ...formData, company_type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="login_type" className="block text-sm font-medium text-gray-700">{t("forms.company.loginType")}</label>
                  <SearchableSelect
                    id="login_type"
                    value={formData.login_type}
                    onChange={(value) => setFormData({ ...formData, login_type: value })}
                    options={loginTypeOptions}
                    placeholder={t("forms.company.loginType")}
                    emptyText={t("common.noResults")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login_page_url" className="block text-sm font-medium text-gray-700">{t("forms.company.loginPageUrl")}</label>
                <input id="login_page_url" type="url" value={formData.login_page_url} onChange={(e) => setFormData({ ...formData, login_page_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="otp_email" className="block text-sm font-medium text-gray-700">{t("forms.company.otpEmail")}</label>
                  <input id="otp_email" type="email" value={formData.otp_email} onChange={(e) => setFormData({ ...formData, otp_email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="otp_mobile_number" className="block text-sm font-medium text-gray-700">{t("forms.company.otpMobile")}</label>
                  <input id="otp_mobile_number" value={formData.otp_mobile_number} onChange={(e) => setFormData({ ...formData, otp_mobile_number: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">{t("forms.company.userName")}</label>
                  <input id="user_name" value={formData.user_name} onChange={(e) => setFormData({ ...formData, user_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="user_name_type" className="block text-sm font-medium text-gray-700">{t("forms.company.userNameType")}</label>
                  <SearchableSelect
                    id="user_name_type"
                    value={formData.user_name_type}
                    onChange={(value) => setFormData({ ...formData, user_name_type: value })}
                    options={userNameTypeOptions}
                    placeholder={t("forms.company.userNameType")}
                    emptyText={t("common.noResults")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">{t("forms.company.userId")}</label>
                  <input id="user_id" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="vat_id" className="block text-sm font-medium text-gray-700">{t("forms.company.vatId")}</label>
                  <input id="vat_id" value={formData.vat_id} onChange={(e) => setFormData({ ...formData, vat_id: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t("forms.company.password")}</label>
                  <input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-brand"/>
                </div>
              </div>
            </form>
        </ModalShell>
    );
}
