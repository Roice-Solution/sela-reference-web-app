import { useEffect, useMemo, useState } from "react";
import { TopNavigation } from "./TopNavigation";
import { GenericTablePage } from "./GenericTablePage";
import { toast } from "sonner";
import { CompanyFormDialog } from "./forms/CompanyFormDialog";
import { MasterProductFormDialog } from "./forms/MasterProductFormDialog";
import { MasterAgentFormDialog } from "./forms/MasterAgentFormDialog";
import { ProductPerCompanyFormDialog } from "./forms/ProductPerCompanyFormDialog";
import { AgentPerCompanyFormDialog } from "./forms/AgentPerCompanyFormDialog";
import { UserAccessFormDialog } from "./forms/UserAccessFormDialog";
import { agentsPerCompanyApi, companiesApi, masterAgentsApi, masterProductsApi, productsPerCompanyApi, userAccessApi, } from "../api/supabase";
import { useI18n } from "../i18n/i18n";
import { ExcelUploadPage } from "./ExcelUploadPage";
import { downloadExcelData, downloadExcelTemplateWorkbook, parseSheetRows, readExcelWorkbook } from "../utils/excel";
export function DatabaseManager({ userEmail, onLogout }) {
    const { t } = useI18n();
    const [currentPage, setCurrentPage] = useState("companies");
    // State for all tables
    const [companies, setCompanies] = useState([]);
    const [masterProducts, setMasterProducts] = useState([]);
    const [masterAgents, setMasterAgents] = useState([]);
    const [productsPerCompany, setProductsPerCompany] = useState([]);
    const [agentsPerCompany, setAgentsPerCompany] = useState([]);
    const [userAccess, setUserAccess] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [pendingUploads, setPendingUploads] = useState(null);
    // Column configurations for each table
    const companyColumns = [
        { key: "company_code", label: t("columns.code"), width: "w-[120px]", type: "code" },
        { key: "company_name_en", label: t("columns.companyName"), width: "w-[250px]" },
        { key: "company_type", label: t("columns.type"), width: "w-[120px]" },
        { key: "login_type", label: t("columns.loginType"), width: "w-[100px]" },
        { key: "otp_email", label: t("columns.otsEmail"), width: "w-[200px]", type: "email" },
        { key: "status", label: t("common.status"), width: "w-[100px]", type: "status" },
        { key: "created_at", label: t("columns.created"), width: "w-[120px]", type: "date" },
    ];
    const masterProductColumns = [
        { key: "master_product_code", label: t("columns.code"), width: "w-[150px]", type: "code" },
        { key: "master_product_name", label: t("columns.productName"), width: "w-[250px]" },
        { key: "department_name", label: t("columns.department"), width: "w-[180px]" },
        { key: "master_product_category", label: t("columns.category"), width: "w-[150px]" },
        { key: "created_at", label: t("columns.created"), width: "w-[120px]", type: "date" },
    ];
    const masterAgentColumns = [
        { key: "master_agent_code", label: t("columns.code"), width: "w-[120px]", type: "code" },
        { key: "full_agent_name", label: t("columns.agentName"), width: "w-[200px]" },
        { key: "license_number", label: t("columns.licenseNumber"), width: "w-[150px]" },
        { key: "agent_type", label: t("columns.type"), width: "w-[100px]" },
        { key: "business_cat", label: t("columns.category"), width: "w-[120px]" },
        { key: "agent_status", label: t("common.status"), width: "w-[100px]", type: "status" },
        { key: "agent_start_date", label: t("columns.startDate"), width: "w-[120px]", type: "date" },
    ];
    const productPerCompanyColumns = [
        { key: "id", label: t("columns.id"), width: "w-[80px]" },
        { key: "company_code", label: t("columns.company"), width: "w-[120px]", type: "code" },
        { key: "company_product_name", label: t("columns.productName"), width: "w-[250px]" },
        { key: "master_product_code", label: t("columns.masterProduct"), width: "w-[150px]", type: "code" },
        { key: "created_at", label: t("columns.created"), width: "w-[120px]", type: "date" },
    ];
    const agentPerCompanyColumns = [
        { key: "id", label: t("columns.id"), width: "w-[80px]" },
        { key: "company_code", label: t("columns.company"), width: "w-[120px]", type: "code" },
        { key: "master_agent_code", label: t("columns.agent"), width: "w-[120px]", type: "code" },
        { key: "master_product_code", label: t("columns.masterProduct"), width: "w-[120px]", type: "code" },
        { key: "comments", label: t("columns.comments"), width: "w-[200px]" },
        { key: "created_at", label: t("columns.created"), width: "w-[120px]", type: "date" },
    ];
    const userAccessColumns = [
        { key: "id", label: t("columns.id"), width: "w-[80px]" },
        { key: "user_id", label: t("columns.userId"), width: "w-[250px]", type: "code" },
        { key: "role", label: t("columns.role"), width: "w-[120px]" },
        { key: "created_at", label: t("columns.created"), width: "w-[150px]", type: "date" },
    ];
    const excelConfig = useMemo(() => ({
        companies: {
            fileName: "companies",
            sheetName: "companies",
            label: t("tables.companiesTitle"),
            templateHeaders: [
                { key: "company_name", label: t("forms.company.companyNameAr") },
                { key: "company_name_en", label: t("forms.company.companyNameEn") },
                { key: "company_type", label: t("forms.company.companyType") },
                { key: "login_type", label: t("forms.company.loginType") },
                { key: "login_page_url", label: t("forms.company.loginPageUrl") },
                { key: "otp_email", label: t("forms.company.otpEmail") },
                { key: "otp_mobile_number", label: t("forms.company.otpMobile") },
                { key: "user_name", label: t("forms.company.userName") },
                { key: "user_name_type", label: t("forms.company.userNameType") },
                { key: "user_id", label: t("forms.company.userId") },
                { key: "vat_id", label: t("forms.company.vatId") },
                { key: "password", label: t("forms.company.password") },
                { key: "status", label: t("common.status") },
            ],
            downloadHeaders: [
                { key: "company_code", label: t("columns.code") },
                { key: "company_name", label: t("forms.company.companyNameAr") },
                { key: "company_name_en", label: t("columns.companyName") },
                { key: "company_type", label: t("columns.type") },
                { key: "login_page_url", label: t("forms.company.loginPageUrl") },
                { key: "login_type", label: t("columns.loginType") },
                { key: "otp_email", label: t("forms.company.otpEmail") },
                { key: "otp_mobile_number", label: t("forms.company.otpMobile") },
                { key: "user_name", label: t("forms.company.userName") },
                { key: "user_name_type", label: t("forms.company.userNameType") },
                { key: "user_id", label: t("forms.company.userId") },
                { key: "vat_id", label: t("forms.company.vatId") },
                { key: "password", label: t("forms.company.password") },
                { key: "status", label: t("common.status") },
                { key: "created_at", label: t("columns.created") },
                { key: "updated_at", label: t("columns.updated") },
                { key: "updated_by", label: t("columns.updatedBy") },
                { key: "created_by", label: t("columns.createdBy") },
            ],
            data: companies,
            upload: (rows) => companiesApi.create(rows),
        },
        "master-products": {
            fileName: "master-products",
            sheetName: "master-products",
            label: t("tables.masterProductsTitle"),
            templateHeaders: [
                { key: "master_product_name", label: t("forms.masterProduct.productName") },
                { key: "department_name", label: t("forms.masterProduct.departmentName") },
                { key: "master_product_category", label: t("forms.masterProduct.productCategory") },
            ],
            downloadHeaders: [
                { key: "master_product_code", label: t("columns.code") },
                { key: "master_product_name", label: t("columns.productName") },
                { key: "department_name", label: t("columns.department") },
                { key: "master_product_category", label: t("columns.category") },
                { key: "created_at", label: t("columns.created") },
                { key: "updated_at", label: t("columns.updated") },
                { key: "updated_by", label: t("columns.updatedBy") },
                { key: "created_by", label: t("columns.createdBy") },
            ],
            data: masterProducts,
            upload: (rows) => masterProductsApi.create(rows),
        },
        "master-agents": {
            fileName: "master-agents",
            sheetName: "master-agents",
            label: t("tables.masterAgentsTitle"),
            templateHeaders: [
                { key: "full_agent_name", label: t("forms.masterAgent.fullName") },
                { key: "license_owner_name", label: t("forms.masterAgent.licenseOwnerName") },
                { key: "license_owner_id", label: t("forms.masterAgent.licenseOwnerId") },
                { key: "license_number", label: t("forms.masterAgent.licenseNumber") },
                { key: "license_owner_mobile_number", label: t("forms.masterAgent.mobileNumber") },
                { key: "license_owner_phone", label: t("forms.masterAgent.phoneNumber") },
                { key: "license_owner_email", label: t("forms.masterAgent.email") },
                { key: "business_cat", label: t("forms.masterAgent.businessCategory") },
                { key: "agent_type", label: t("forms.masterAgent.agentType") },
                { key: "agent_start_date", label: t("forms.masterAgent.startDate") },
                { key: "agent_end_date", label: t("forms.masterAgent.endDate") },
                { key: "role", label: t("forms.masterAgent.role") },
                { key: "supervisor_name", label: t("forms.masterAgent.supervisorName") },
                { key: "supervisor_id_number", label: t("forms.masterAgent.supervisorId") },
                { key: "comments", label: t("forms.masterAgent.comments") },
                { key: "agent_status", label: t("common.status") },
            ],
            downloadHeaders: [
                { key: "master_agent_code", label: t("columns.code") },
                { key: "full_agent_name", label: t("columns.agentName") },
                { key: "license_owner_name", label: t("forms.masterAgent.licenseOwnerName") },
                { key: "license_owner_id", label: t("forms.masterAgent.licenseOwnerId") },
                { key: "license_number", label: t("columns.licenseNumber") },
                { key: "license_owner_mobile_number", label: t("forms.masterAgent.mobileNumber") },
                { key: "license_owner_phone", label: t("forms.masterAgent.phoneNumber") },
                { key: "license_owner_email", label: t("forms.masterAgent.email") },
                { key: "business_cat", label: t("columns.category") },
                { key: "agent_type", label: t("columns.type") },
                { key: "agent_start_date", label: t("columns.startDate") },
                { key: "agent_end_date", label: t("forms.masterAgent.endDate") },
                { key: "role", label: t("columns.role") },
                { key: "supervisor_name", label: t("forms.masterAgent.supervisorName") },
                { key: "supervisor_id_number", label: t("forms.masterAgent.supervisorId") },
                { key: "comments", label: t("columns.comments") },
                { key: "agent_status", label: t("common.status") },
                { key: "created_at", label: t("columns.created") },
                { key: "updated_at", label: t("columns.updated") },
            ],
            data: masterAgents,
            upload: (rows) => masterAgentsApi.create(rows),
        },
        "products-per-company": {
            fileName: "products-per-company",
            sheetName: "products-per-company",
            label: t("tables.productsPerCompanyTitle"),
            templateHeaders: [
                { key: "company_code", label: t("forms.productPerCompany.company") },
                { key: "master_product_code", label: t("forms.productPerCompany.masterProduct") },
                { key: "company_product_name", label: t("forms.productPerCompany.companyProductName") },
            ],
            downloadHeaders: [
                { key: "id", label: t("columns.id") },
                { key: "company_code", label: t("columns.company") },
                { key: "master_product_code", label: t("columns.masterProduct") },
                { key: "company_product_name", label: t("columns.productName") },
                { key: "created_at", label: t("columns.created") },
                { key: "updated_at", label: t("columns.updated") },
                { key: "updated_by", label: t("columns.updatedBy") },
                { key: "created_by", label: t("columns.createdBy") },
            ],
            data: productsPerCompany,
            upload: (rows) => productsPerCompanyApi.create(rows),
        },
        "agents-per-company": {
            fileName: "agents-per-company",
            sheetName: "agents-per-company",
            label: t("tables.agentsPerCompanyTitle"),
            templateHeaders: [
                { key: "company_code", label: t("forms.agentPerCompany.company") },
                { key: "master_agent_code", label: t("forms.agentPerCompany.masterAgent") },
                { key: "master_product_code", label: t("forms.agentPerCompany.masterProduct") },
                { key: "company_product_code", label: t("forms.agentPerCompany.companyProductCode") },
                { key: "comments", label: t("forms.agentPerCompany.comments") },
            ],
            downloadHeaders: [
                { key: "id", label: t("columns.id") },
                { key: "company_code", label: t("columns.company") },
                { key: "master_agent_code", label: t("columns.agent") },
                { key: "master_product_code", label: t("columns.masterProduct") },
                { key: "company_product_code", label: t("forms.agentPerCompany.companyProductCode") },
                { key: "comments", label: t("columns.comments") },
                { key: "created_at", label: t("columns.created") },
                { key: "updated_at", label: t("columns.updated") },
                { key: "updated_by", label: t("columns.updatedBy") },
                { key: "created_by", label: t("columns.createdBy") },
            ],
            data: agentsPerCompany,
            upload: (rows) => agentsPerCompanyApi.create(rows),
        },
        "user-access": {
            fileName: "user-access",
            sheetName: "user-access",
            label: t("tables.userAccessTitle"),
            templateHeaders: [
                { key: "user_id", label: t("forms.userAccess.userId") },
                { key: "role", label: t("forms.userAccess.role") },
            ],
            downloadHeaders: [
                { key: "id", label: t("columns.id") },
                { key: "user_id", label: t("columns.userId") },
                { key: "role", label: t("columns.role") },
                { key: "created_at", label: t("columns.created") },
                { key: "updated_at", label: t("columns.updated") },
            ],
            data: userAccess,
            upload: (rows) => userAccessApi.create(rows),
        },
    }), [agentPerCompanyColumns, companies, companyColumns, masterAgentColumns, masterAgents, masterProductColumns, masterProducts, productsPerCompany, productPerCompanyColumns, t, userAccess, userAccessColumns]);
    const handleDownloadTemplate = () => {
        const sheets = Object.values(excelConfig).map((config) => ({
            sheetName: config.sheetName,
            headerSpecs: config.templateHeaders,
        }));
        downloadExcelTemplateWorkbook({
            fileName: "reference-tables",
            sheets,
        });
        toast.success(t("toasts.excelTemplateReady"));
    };
    const handleDownloadExcel = () => {
        const config = excelConfig[currentPage];
        if (!config) return;
        downloadExcelData({
            fileName: config.fileName,
            sheetName: config.sheetName,
            headerSpecs: config.downloadHeaders,
            data: config.data,
        });
        toast.success(t("toasts.excelDownloadReady"));
    };
    const normalizeSheetName = (name) =>
        String(name || "").trim().toLowerCase().replace(/\s+/g, "-");
    const handleExcelFileSelected = async (file) => {
        setIsSaving(true);
        try {
            const workbook = await readExcelWorkbook(file);
            const tables = [];
            let totalRows = 0;
            Object.entries(excelConfig).forEach(([key, config]) => {
                const sheet = Object.keys(workbook).find((sheetName) => normalizeSheetName(sheetName) === normalizeSheetName(config.sheetName) ||
                    normalizeSheetName(sheetName) === normalizeSheetName(config.label));
                if (!sheet) return;
                const rows = parseSheetRows(workbook[sheet], config.templateHeaders);
                if (!rows.length) return;
                totalRows += rows.length;
                tables.push({
                    key,
                    label: config.label,
                    rows,
                    headers: config.templateHeaders,
                    upload: config.upload,
                });
            });
            if (!tables.length) {
                toast.error(t("toasts.excelNoRows"));
                return;
            }
            setPendingUploads({ tables, totalRows });
        }
        catch (error) {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.excelUploadFailed") + details);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleConfirmUpload = async () => {
        if (!pendingUploads)
            return;
        setIsSaving(true);
        try {
            for (const table of pendingUploads.tables) {
                await table.upload(table.rows);
            }
            toast.success(t("toasts.excelUploadSuccess"));
            setPendingUploads(null);
            await loadForPage(currentPage);
        }
        catch (error) {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.excelUploadFailed") + details);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleCancelUpload = () => {
        setPendingUploads(null);
    };
    const loadForPage = async (page) => {
        setIsLoading(true);
        try {
            const getValue = (result, label) => {
                if (result.status === "fulfilled") {
                    return result.value || [];
                }
                const details = result.reason?.message ? ` ${result.reason.message}` : "";
                toast.error(t("toasts.loadLabelFailed", { label }) + details);
                return [];
            };
            switch (page) {
                case "companies": {
                    const result = await Promise.allSettled([companiesApi.list()]);
                    setCompanies(getValue(result[0], t("tables.companiesTitle")));
                    break;
                }
                case "master-products": {
                    const result = await Promise.allSettled([masterProductsApi.list()]);
                    setMasterProducts(getValue(result[0], t("tables.masterProductsTitle")));
                    break;
                }
                case "master-agents": {
                    const result = await Promise.allSettled([masterAgentsApi.list()]);
                    setMasterAgents(getValue(result[0], t("tables.masterAgentsTitle")));
                    break;
                }
                case "products-per-company": {
                    const results = await Promise.allSettled([
                        productsPerCompanyApi.list(),
                        companiesApi.list(),
                        masterProductsApi.list(),
                    ]);
                    setProductsPerCompany(getValue(results[0], t("tables.productsPerCompanyTitle")));
                    setCompanies(getValue(results[1], t("tables.companiesTitle")));
                    setMasterProducts(getValue(results[2], t("tables.masterProductsTitle")));
                    break;
                }
                case "agents-per-company": {
                    const results = await Promise.allSettled([
                        agentsPerCompanyApi.list(),
                        companiesApi.list(),
                        masterAgentsApi.list(),
                        masterProductsApi.list(),
                    ]);
                    setAgentsPerCompany(getValue(results[0], t("tables.agentsPerCompanyTitle")));
                    setCompanies(getValue(results[1], t("tables.companiesTitle")));
                    setMasterAgents(getValue(results[2], t("tables.masterAgentsTitle")));
                    setMasterProducts(getValue(results[3], t("tables.masterProductsTitle")));
                    break;
                }
                case "user-access": {
                    const result = await Promise.allSettled([userAccessApi.list()]);
                    setUserAccess(getValue(result[0], t("tables.userAccessTitle")));
                    break;
                }
                default:
                    break;
            }
        }
        catch (error) {
            toast.error(error?.message || t("toasts.loadDataFailed"));
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        let isMounted = true;
        const loadCurrentPage = async () => {
            if (!isMounted)
                return;
            await loadForPage(currentPage);
        };
        loadCurrentPage();
        return () => {
            isMounted = false;
        };
    }, [currentPage]);
    // CRUD handlers for Companies
    const handleAddCompany = (company) => {
        setIsSaving(true);
        companiesApi
            .create(company)
            .then(() => {
            toast.success(t("toasts.companyAdded"));
            setIsAddDialogOpen(false);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.companyAddFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleEditCompany = (company) => {
        if (!editingItem) {
            return;
        }
        setIsSaving(true);
        companiesApi
            .update(editingItem.company_code, company)
            .then(() => {
            toast.success(t("toasts.companyUpdated"));
            setEditingItem(null);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.companyUpdateFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleDeleteCompany = (company) => {
        setIsSaving(true);
        companiesApi
            .remove(company.company_code)
            .then(() => {
            toast.success(t("toasts.companyDeleted"));
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.companyDeleteFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    // CRUD handlers for Master Products
    const handleAddMasterProduct = (product) => {
        setIsSaving(true);
        masterProductsApi
            .create(product)
            .then(() => {
            toast.success(t("toasts.productAdded"));
            setIsAddDialogOpen(false);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productAddFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleEditMasterProduct = (product) => {
        if (!editingItem) {
            return;
        }
        setIsSaving(true);
        masterProductsApi
            .update(editingItem.master_product_code, product)
            .then(() => {
            toast.success(t("toasts.productUpdated"));
            setEditingItem(null);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productUpdateFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleDeleteMasterProduct = (product) => {
        setIsSaving(true);
        masterProductsApi
            .remove(product.master_product_code)
            .then(() => {
            toast.success(t("toasts.productDeleted"));
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productDeleteFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    // CRUD handlers for Master Agents
    const handleAddMasterAgent = (agent) => {
        setIsSaving(true);
        masterAgentsApi
            .create(agent)
            .then(() => {
            toast.success(t("toasts.agentAdded"));
            setIsAddDialogOpen(false);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentAddFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleEditMasterAgent = (agent) => {
        if (!editingItem) {
            return;
        }
        setIsSaving(true);
        masterAgentsApi
            .update(editingItem.master_agent_code, agent)
            .then(() => {
            toast.success(t("toasts.agentUpdated"));
            setEditingItem(null);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentUpdateFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleDeleteMasterAgent = (agent) => {
        setIsSaving(true);
        masterAgentsApi
            .remove(agent.master_agent_code)
            .then(() => {
            toast.success(t("toasts.agentDeleted"));
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentDeleteFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    // CRUD handlers for Products Per Company
    const handleAddProductPerCompany = (product) => {
        setIsSaving(true);
        productsPerCompanyApi
            .create(product)
            .then(() => {
            toast.success(t("toasts.productLinkAdded"));
            setIsAddDialogOpen(false);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productLinkAddFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleEditProductPerCompany = (product) => {
        if (!editingItem) {
            return;
        }
        setIsSaving(true);
        productsPerCompanyApi
            .update(editingItem.id, product)
            .then(() => {
            toast.success(t("toasts.productLinkUpdated"));
            setEditingItem(null);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productLinkUpdateFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleDeleteProductPerCompany = (product) => {
        setIsSaving(true);
        productsPerCompanyApi
            .remove(product.id)
            .then(() => {
            toast.success(t("toasts.productLinkDeleted"));
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productLinkDeleteFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    // CRUD handlers for Agents Per Company
    const handleAddAgentPerCompany = (agent) => {
        setIsSaving(true);
        agentsPerCompanyApi
            .create(agent)
            .then(() => {
            toast.success(t("toasts.agentAssignmentAdded"));
            setIsAddDialogOpen(false);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentAssignmentAddFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleEditAgentPerCompany = (agent) => {
        if (!editingItem) {
            return;
        }
        setIsSaving(true);
        agentsPerCompanyApi
            .update(editingItem.id, agent)
            .then(() => {
            toast.success(t("toasts.agentAssignmentUpdated"));
            setEditingItem(null);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentAssignmentUpdateFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleDeleteAgentPerCompany = (agent) => {
        setIsSaving(true);
        agentsPerCompanyApi
            .remove(agent.id)
            .then(() => {
            toast.success(t("toasts.agentAssignmentDeleted"));
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentAssignmentDeleteFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    // CRUD handlers for User Access
    const handleAddUserAccess = (user) => {
        setIsSaving(true);
        userAccessApi
            .create(user)
            .then(() => {
            toast.success(t("toasts.userAccessAdded"));
            setIsAddDialogOpen(false);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.userAccessAddFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleEditUserAccess = (user) => {
        if (!editingItem) {
            return;
        }
        setIsSaving(true);
        userAccessApi
            .update(editingItem.id, user)
            .then(() => {
            toast.success(t("toasts.userAccessUpdated"));
            setEditingItem(null);
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.userAccessUpdateFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const handleDeleteUserAccess = (user) => {
        setIsSaving(true);
        userAccessApi
            .remove(user.id)
            .then(() => {
            toast.success(t("toasts.userAccessDeleted"));
            loadForPage(currentPage);
        })
            .catch((error) => {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.userAccessDeleteFailed") + details);
        })
            .finally(() => {
            setIsSaving(false);
        });
    };
    const renderPage = () => {
        switch (currentPage) {
            case "companies":
                return (<>
            <GenericTablePage title={t("tables.companiesTitle")} description={t("tables.companiesDescription")} columns={companyColumns} data={companies} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onDelete={handleDeleteCompany} getItemId={(item) => item.company_code} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel}/>
            <CompanyFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddCompany} mode="add"/>
            {editingItem && (<CompanyFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditCompany} mode="edit" initialData={editingItem}/>)}
          </>);
            case "master-products":
                return (<>
            <GenericTablePage title={t("tables.masterProductsTitle")} description={t("tables.masterProductsDescription")} columns={masterProductColumns} data={masterProducts} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onDelete={handleDeleteMasterProduct} getItemId={(item) => item.master_product_code} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel}/>
            <MasterProductFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddMasterProduct} mode="add"/>
            {editingItem && (<MasterProductFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditMasterProduct} mode="edit" initialData={editingItem}/>)}
          </>);
            case "master-agents":
                return (<>
            <GenericTablePage title={t("tables.masterAgentsTitle")} description={t("tables.masterAgentsDescription")} columns={masterAgentColumns} data={masterAgents} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onDelete={handleDeleteMasterAgent} getItemId={(item) => item.master_agent_code} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel}/>
            <MasterAgentFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddMasterAgent} mode="add"/>
            {editingItem && (<MasterAgentFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditMasterAgent} mode="edit" initialData={editingItem}/>)}
          </>);
            case "products-per-company":
                return (<>
            <GenericTablePage title={t("tables.productsPerCompanyTitle")} description={t("tables.productsPerCompanyDescription")} columns={productPerCompanyColumns} data={productsPerCompany} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onDelete={handleDeleteProductPerCompany} getItemId={(item) => item.id} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel}/>
            <ProductPerCompanyFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddProductPerCompany} mode="add" companies={companies} masterProducts={masterProducts}/>
            {editingItem && (<ProductPerCompanyFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditProductPerCompany} mode="edit" initialData={editingItem} companies={companies} masterProducts={masterProducts}/>)}
          </>);
            case "agents-per-company":
                return (<>
            <GenericTablePage title={t("tables.agentsPerCompanyTitle")} description={t("tables.agentsPerCompanyDescription")} columns={agentPerCompanyColumns} data={agentsPerCompany} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onDelete={handleDeleteAgentPerCompany} getItemId={(item) => item.id} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel}/>
            <AgentPerCompanyFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddAgentPerCompany} mode="add" companies={companies} masterAgents={masterAgents} masterProducts={masterProducts}/>
            {editingItem && (<AgentPerCompanyFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditAgentPerCompany} mode="edit" initialData={editingItem} companies={companies} masterAgents={masterAgents} masterProducts={masterProducts}/>)}
          </>);
            case "user-access":
                return (<>
            <GenericTablePage title={t("tables.userAccessTitle")} description={t("tables.userAccessDescription")} columns={userAccessColumns} data={userAccess} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onDelete={handleDeleteUserAccess} getItemId={(item) => item.id} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel}/>
            <UserAccessFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddUserAccess} mode="add"/>
            {editingItem && (<UserAccessFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditUserAccess} mode="edit" initialData={editingItem}/>)}
          </>);
            case "excel-upload":
                return (<ExcelUploadPage tables={Object.entries(excelConfig).map(([key, config]) => ({
                        key,
                        label: config.label,
                        sheetName: config.sheetName,
                    }))} onDownloadTemplate={handleDownloadTemplate} onFileSelected={handleExcelFileSelected} pendingUploads={pendingUploads} onConfirmUpload={handleConfirmUpload} onCancelUpload={handleCancelUpload} isSaving={isSaving}/>);
            default:
                return null;
        }
    };
    return (<div className="min-h-screen bg-gray-50">
      <TopNavigation currentPage={currentPage} onNavigate={setCurrentPage} onLogout={onLogout} userEmail={userEmail}/>
      {renderPage()}
    </div>);
}
