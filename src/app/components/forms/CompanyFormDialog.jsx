import { useId, useState, useEffect } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
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
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
                    <input id="company_code" value={formData.company_code} onChange={(e) => setFormData({ ...formData, company_code: e.target.value })} required disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">{t("common.status")}</label>
                    <select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="Active">{t("forms.company.statusActive")}</option>
                      <option value="Cancelled">{t("forms.company.statusCancelled")}</option>
                    </select>
                  </div>
                </div>)}

              <div className="space-y-2">
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">{t("forms.company.companyNameAr")}</label>
                <input id="company_name" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="space-y-2">
                <label htmlFor="company_name_en" className="block text-sm font-medium text-gray-700">{t("forms.company.companyNameEn")}</label>
                <input id="company_name_en" value={formData.company_name_en} onChange={(e) => setFormData({ ...formData, company_name_en: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="company_type" className="block text-sm font-medium text-gray-700">{t("forms.company.companyType")}</label>
                  <input id="company_type" value={formData.company_type} onChange={(e) => setFormData({ ...formData, company_type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="login_type" className="block text-sm font-medium text-gray-700">{t("forms.company.loginType")}</label>
                  <select id="login_type" value={formData.login_type} onChange={(e) => setFormData({ ...formData, login_type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="SMS">{t("forms.company.loginTypeBasic")}</option>
                    <option value="EMAIL">{t("forms.company.loginTypeSso")}</option>
                    <option value="NONE">{t("forms.company.loginTypeOauth")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login_page_url" className="block text-sm font-medium text-gray-700">{t("forms.company.loginPageUrl")}</label>
                <input id="login_page_url" type="url" value={formData.login_page_url} onChange={(e) => setFormData({ ...formData, login_page_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="otp_email" className="block text-sm font-medium text-gray-700">{t("forms.company.otpEmail")}</label>
                  <input id="otp_email" type="email" value={formData.otp_email} onChange={(e) => setFormData({ ...formData, otp_email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="otp_mobile_number" className="block text-sm font-medium text-gray-700">{t("forms.company.otpMobile")}</label>
                  <input id="otp_mobile_number" value={formData.otp_mobile_number} onChange={(e) => setFormData({ ...formData, otp_mobile_number: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">{t("forms.company.userName")}</label>
                  <input id="user_name" value={formData.user_name} onChange={(e) => setFormData({ ...formData, user_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="user_name_type" className="block text-sm font-medium text-gray-700">{t("forms.company.userNameType")}</label>
                  <select id="user_name_type" value={formData.user_name_type} onChange={(e) => setFormData({ ...formData, user_name_type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="ID">{t("forms.company.userNameTypeEmail")}</option>
                    <option value="VATID">{t("forms.company.userNameTypeUsername")}</option>
                    <option value="USER">{t("forms.company.userNameTypeId")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">{t("forms.company.userId")}</label>
                  <input id="user_id" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="vat_id" className="block text-sm font-medium text-gray-700">{t("forms.company.vatId")}</label>
                  <input id="vat_id" value={formData.vat_id} onChange={(e) => setFormData({ ...formData, vat_id: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t("forms.company.password")}</label>
                  <input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
              </div>
            </form>
        </ModalShell>
    );
}
