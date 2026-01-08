import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "../../i18n/i18n";
export function AgentPerCompanyFormDialog({ open, onOpenChange, onSave, mode, initialData, companies, masterAgents, masterProducts, }) {
    const { t } = useI18n();
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
    if (!open) {
        return null;
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border-2 border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b-2 border-blue-100 bg-blue-50">
          <div>
            <h2 className="text-lg font-bold text-blue-900">{mode === "add" ? t("forms.agentPerCompany.titleAdd") : t("forms.agentPerCompany.titleEdit")}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? t("forms.agentPerCompany.subtitleAdd") : t("forms.agentPerCompany.subtitleEdit")}
            </p>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <label htmlFor="company_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.company")}</label>
              <select id="company_code" value={formData.company_code} onChange={(e) => setFormData({ ...formData, company_code: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="" disabled>{t("forms.agentPerCompany.selectCompany")}</option>
                {companies.map((company) => (<option key={company.company_code} value={company.company_code}>
                    {company.company_name_en}
                  </option>))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="master_agent_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.masterAgent")}</label>
              <select id="master_agent_code" value={formData.master_agent_code} onChange={(e) => setFormData({ ...formData, master_agent_code: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="" disabled>{t("forms.agentPerCompany.selectAgent")}</option>
                {masterAgents.map((agent) => (<option key={agent.master_agent_code} value={agent.master_agent_code}>
                    {agent.full_agent_name}
                  </option>))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="master_product_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.masterProduct")}</label>
              <select id="master_product_code" value={formData.master_product_code} onChange={(e) => setFormData({ ...formData, master_product_code: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="" disabled>{t("forms.agentPerCompany.selectProduct")}</option>
                {masterProducts.map((product) => (<option key={product.master_product_code} value={product.master_product_code}>
                    {product.master_product_name}
                  </option>))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="company_product_code" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.companyProductCode")}</label>
              <input id="company_product_code" value={formData.company_product_code} onChange={(e) => setFormData({ ...formData, company_product_code: e.target.value })} placeholder={t("forms.agentPerCompany.companyProductPlaceholder")} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">{t("forms.agentPerCompany.comments")}</label>
              <textarea id="comments" value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} rows={3} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t-2 border-gray-200 px-6 py-4 bg-gray-50">
            <button type="button" className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {mode === "add" ? t("forms.agentPerCompany.add") : t("common.saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
