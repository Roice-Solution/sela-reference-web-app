import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "../../i18n/i18n";
export function CompanyFormDialog({ open, onOpenChange, onSave, mode, initialData, }) {
    const { t } = useI18n();
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
    if (!open) {
        return null;
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col border-2 border-gray-200">
        <div className="flex items-center justify-between p-6 border-b-2 border-blue-100 bg-blue-50">
          <div>
            <h2 className="text-lg font-bold text-blue-900">{mode === "add" ? t("forms.company.titleAdd") : t("forms.company.titleEdit")}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? t("forms.company.subtitleAdd") : t("forms.company.subtitleEdit")}
            </p>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto px-6 py-4 flex-1">
            <div className="space-y-4">
              {mode === "edit" && (<div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="company_code" className="block text-sm font-medium text-gray-700">{t("forms.company.companyCode")}</label>
                    <input id="company_code" value={formData.company_code} onChange={(e) => setFormData({ ...formData, company_code: e.target.value })} required disabled className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">{t("common.status")}</label>
                    <select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="Active">{t("forms.company.statusActive")}</option>
                      <option value="Cancelled">{t("forms.company.statusCancelled")}</option>
                    </select>
                  </div>
                </div>)}

              <div className="space-y-2">
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">{t("forms.company.companyNameAr")}</label>
                <input id="company_name" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="space-y-2">
                <label htmlFor="company_name_en" className="block text-sm font-medium text-gray-700">{t("forms.company.companyNameEn")}</label>
                <input id="company_name_en" value={formData.company_name_en} onChange={(e) => setFormData({ ...formData, company_name_en: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="company_type" className="block text-sm font-medium text-gray-700">{t("forms.company.companyType")}</label>
                  <input id="company_type" value={formData.company_type} onChange={(e) => setFormData({ ...formData, company_type: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="login_type" className="block text-sm font-medium text-gray-700">{t("forms.company.loginType")}</label>
                  <select id="login_type" value={formData.login_type} onChange={(e) => setFormData({ ...formData, login_type: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="SMS">{t("forms.company.loginTypeBasic")}</option>
                    <option value="EMAIL">{t("forms.company.loginTypeSso")}</option>
                    <option value="NONE">{t("forms.company.loginTypeOauth")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login_page_url" className="block text-sm font-medium text-gray-700">{t("forms.company.loginPageUrl")}</label>
                <input id="login_page_url" type="url" value={formData.login_page_url} onChange={(e) => setFormData({ ...formData, login_page_url: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="otp_email" className="block text-sm font-medium text-gray-700">{t("forms.company.otpEmail")}</label>
                  <input id="otp_email" type="email" value={formData.otp_email} onChange={(e) => setFormData({ ...formData, otp_email: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="otp_mobile_number" className="block text-sm font-medium text-gray-700">{t("forms.company.otpMobile")}</label>
                  <input id="otp_mobile_number" value={formData.otp_mobile_number} onChange={(e) => setFormData({ ...formData, otp_mobile_number: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">{t("forms.company.userName")}</label>
                  <input id="user_name" value={formData.user_name} onChange={(e) => setFormData({ ...formData, user_name: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="user_name_type" className="block text-sm font-medium text-gray-700">{t("forms.company.userNameType")}</label>
                  <select id="user_name_type" value={formData.user_name_type} onChange={(e) => setFormData({ ...formData, user_name_type: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="ID">{t("forms.company.userNameTypeEmail")}</option>
                    <option value="VATID">{t("forms.company.userNameTypeUsername")}</option>
                    <option value="USER">{t("forms.company.userNameTypeId")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">{t("forms.company.userId")}</label>
                  <input id="user_id" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="vat_id" className="block text-sm font-medium text-gray-700">{t("forms.company.vatId")}</label>
                  <input id="vat_id" value={formData.vat_id} onChange={(e) => setFormData({ ...formData, vat_id: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t("forms.company.password")}</label>
                  <input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t-2 border-gray-200 px-6 py-4 bg-gray-50">
            <button type="button" className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {mode === "add" ? t("forms.company.add") : t("common.saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
