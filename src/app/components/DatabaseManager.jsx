import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./AppShell";
import { HomePage } from "./HomePage";
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
import { RecordDrawer } from "./RecordDrawer";
import { SearchableSelect } from "./ui/SearchableSelect";
export function DatabaseManager({ userEmail, onLogout }) {
    const { t } = useI18n();
    const [currentPage, setCurrentPage] = useState("home");
    const [searchQuery, setSearchQuery] = useState("");
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
    const [drawerItem, setDrawerItem] = useState(null);
    const [drawerPage, setDrawerPage] = useState(null);
    const [pendingUploads, setPendingUploads] = useState(null);
    const [homeCounts, setHomeCounts] = useState(null);
    const [homeLastUpdated, setHomeLastUpdated] = useState({
        companies: null,
        "products-per-company": null,
        "agents-per-company": null,
    });
    const [productMappingForm, setProductMappingForm] = useState({
        master_product_code: "",
        company_product_name: "",
    });
    const [agentMappingForm, setAgentMappingForm] = useState({
        master_agent_code: "",
        master_product_code: "",
        comments: "",
    });
    const homeStats = useMemo(() => ({
        companies: homeCounts?.companies ?? companies.length,
        masterProducts: homeCounts?.masterProducts ?? masterProducts.length,
        masterAgents: homeCounts?.masterAgents ?? masterAgents.length,
        userAccess: homeCounts?.userAccess ?? userAccess.length,
    }), [companies, masterAgents, masterProducts, homeCounts, userAccess]);
    const getLatestTimestamp = (items) => {
        if (!items || items.length === 0) return null;
        return items.reduce((latest, item) => {
            const value = item?.updated_at || item?.created_at;
            if (!value) return latest;
            const time = new Date(value).getTime();
            if (Number.isNaN(time)) return latest;
            if (!latest || time > latest) return time;
            return latest;
        }, null);
    };
    const computedLastUpdated = useMemo(() => ({
        companies: getLatestTimestamp(companies),
        "products-per-company": getLatestTimestamp(productsPerCompany),
        "agents-per-company": getLatestTimestamp(agentsPerCompany),
    }), [companies, productsPerCompany, agentsPerCompany]);
    const mergedLastUpdated = useMemo(() => ({
        companies: computedLastUpdated.companies ?? homeLastUpdated.companies,
        "products-per-company": computedLastUpdated["products-per-company"] ?? homeLastUpdated["products-per-company"],
        "agents-per-company": computedLastUpdated["agents-per-company"] ?? homeLastUpdated["agents-per-company"],
    }), [computedLastUpdated, homeLastUpdated]);
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
        { key: "company_name", label: t("columns.companyName"), width: "w-[200px]" },
        { key: "company_product_name", label: t("columns.companyProductName"), width: "w-[250px]" },
        { key: "master_product_code", label: t("columns.masterProduct"), width: "w-[150px]", type: "code" },
        { key: "master_product_name", label: t("columns.masterProductName"), width: "w-[220px]" },
        { key: "created_at", label: t("columns.created"), width: "w-[120px]", type: "date" },
    ];
    const agentPerCompanyColumns = [
        { key: "id", label: t("columns.id"), width: "w-[80px]" },
        { key: "company_code", label: t("columns.company"), width: "w-[120px]", type: "code" },
        { key: "company_name", label: t("columns.companyName"), width: "w-[200px]" },
        { key: "master_agent_code", label: t("columns.agent"), width: "w-[120px]", type: "code" },
        { key: "master_agent_name", label: t("columns.agentName"), width: "w-[200px]" },
        { key: "master_product_code", label: t("columns.masterProduct"), width: "w-[120px]", type: "code" },
        { key: "master_product_name", label: t("columns.productName"), width: "w-[200px]" },
        { key: "comments", label: t("columns.comments"), width: "w-[200px]" },
        { key: "created_at", label: t("columns.created"), width: "w-[120px]", type: "date" },
    ];
    const userAccessColumns = [
        { key: "id", label: t("columns.id"), width: "w-[80px]" },
        { key: "user_id", label: t("columns.userId"), width: "w-[250px]", type: "code" },
        { key: "role", label: t("columns.role"), width: "w-[120px]" },
        { key: "created_at", label: t("columns.created"), width: "w-[150px]", type: "date" },
    ];
    const normalizedProductsPerCompany = useMemo(
        () =>
            productsPerCompany.map((item) => ({
                ...item,
                company_name: item.company?.company_name ?? item.company_name ?? "",
                master_product_name: item.master_product?.master_product_name ?? item.master_product_name ?? "",
            })),
        [productsPerCompany]
    );
    const normalizedAgentsPerCompany = useMemo(
        () =>
            agentsPerCompany.map((item) => ({
                ...item,
                company_name: item.company?.company_name ?? item.company_name ?? "",
                master_agent_name: item.master_agent?.full_agent_name ?? item.master_agent_name ?? "",
                master_product_name: item.master_product?.master_product_name ?? item.master_product_name ?? "",
            })),
        [agentsPerCompany]
    );
    const excelConfig = useMemo(() => ({
        companies: {
            fileName: "companies",
            sheetName: "companies",
            label: t("tables.companiesTitle"),
            templateHeaders: [
                { key: "company_name", label: t("forms.company.companyNameAr") },
                { key: "company_name_en", label: t("forms.company.companyNameEn") },
                { key: "company_type", label: t("forms.company.companyType") },
                {
                    key: "login_type",
                    label: t("forms.company.loginType"),
                    allowedValues: ["SMS", "EMAIL", "NONE"],
                },
                { key: "login_page_url", label: t("forms.company.loginPageUrl") },
                { key: "otp_email", label: t("forms.company.otpEmail") },
                { key: "otp_mobile_number", label: t("forms.company.otpMobile") },
                { key: "user_name", label: t("forms.company.userName") },
                {
                    key: "user_name_type",
                    label: t("forms.company.userNameType"),
                    allowedValues: ["ID", "VATID", "USER"],
                },
                { key: "user_id", label: t("forms.company.userId") },
                { key: "vat_id", label: t("forms.company.vatId") },
                { key: "password", label: t("forms.company.password") },
                {
                    key: "status",
                    label: t("common.status"),
                    allowedValues: ["Active", "Cancelled"],
                },
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
                {
                    key: "business_cat",
                    label: t("forms.masterAgent.businessCategory"),
                    allowedValues: ["Individual", "Corporate"],
                },
                {
                    key: "agent_type",
                    label: t("forms.masterAgent.agentType"),
                    allowedValues: ["Agent", "Broker"],
                },
                { key: "agent_start_date", label: t("forms.masterAgent.startDate") },
                { key: "agent_end_date", label: t("forms.masterAgent.endDate") },
                { key: "role", label: t("forms.masterAgent.role") },
                { key: "supervisor_name", label: t("forms.masterAgent.supervisorName") },
                { key: "supervisor_id_number", label: t("forms.masterAgent.supervisorId") },
                { key: "comments", label: t("forms.masterAgent.comments") },
                {
                    key: "agent_status",
                    label: t("common.status"),
                    allowedValues: ["active", "inactive"],
                },
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
            data: normalizedProductsPerCompany,
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
            data: normalizedAgentsPerCompany,
            upload: (rows) => agentsPerCompanyApi.create(rows),
        },
        "user-access": {
            fileName: "user-access",
            sheetName: "user-access",
            label: t("tables.userAccessTitle"),
            templateHeaders: [
                { key: "user_id", label: t("forms.userAccess.userId") },
                {
                    key: "role",
                    label: t("forms.userAccess.role"),
                    allowedValues: ["admin", "editor", "viewer"],
                },
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
                case "home": {
                    const results = await Promise.allSettled([
                        companiesApi.count(),
                        masterProductsApi.count(),
                        masterAgentsApi.count(),
                        userAccessApi.count(),
                        companiesApi.latestUpdated(),
                        productsPerCompanyApi.latestUpdated(),
                        agentsPerCompanyApi.latestUpdated(),
                    ]);
                    const getCount = (result, label) => {
                        if (result.status === "fulfilled") return result.value || 0;
                        const details = result.reason?.message ? ` ${result.reason.message}` : "";
                        toast.error(t("toasts.loadLabelFailed", { label }) + details);
                        return 0;
                    };
                    const getLatest = (result, label) => {
                        if (result.status === "fulfilled") return result.value || null;
                        const details = result.reason?.message ? ` ${result.reason.message}` : "";
                        toast.error(t("toasts.loadLabelFailed", { label }) + details);
                        return null;
                    };
                    setHomeCounts({
                        companies: getCount(results[0], t("tables.companiesTitle")),
                        masterProducts: getCount(results[1], t("tables.masterProductsTitle")),
                        masterAgents: getCount(results[2], t("tables.masterAgentsTitle")),
                        userAccess: getCount(results[3], t("tables.userAccessTitle")),
                    });
                    setHomeLastUpdated({
                        companies: getLatest(results[4], t("tables.companiesTitle")),
                        "products-per-company": getLatest(results[5], t("tables.productsPerCompanyTitle")),
                        "agents-per-company": getLatest(results[6], t("tables.agentsPerCompanyTitle")),
                    });
                    break;
                }
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
        if (!window.confirm(t("common.confirmDelete"))) return;
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
        if (!window.confirm(t("common.confirmDelete"))) return;
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
        if (!window.confirm(t("common.confirmDelete"))) return;
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
        if (!window.confirm(t("common.confirmDelete"))) return;
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
        if (!window.confirm(t("common.confirmDelete"))) return;
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
        if (!window.confirm(t("common.confirmDelete"))) return;
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
    const homePages = [
        {
            key: "companies",
            label: t("nav.companies"),
            description: t("tables.companiesDescription"),
        },
        {
            key: "master-products",
            label: t("nav.masterProducts"),
            description: t("tables.masterProductsDescription"),
        },
        {
            key: "master-agents",
            label: t("nav.masterAgents"),
            description: t("tables.masterAgentsDescription"),
        },
        {
            key: "products-per-company",
            label: t("nav.productsPerCompany"),
            description: t("tables.productsPerCompanyDescription"),
        },
        {
            key: "agents-per-company",
            label: t("nav.agentsPerCompany"),
            description: t("tables.agentsPerCompanyDescription"),
        },
        {
            key: "user-access",
            label: t("nav.userAccess"),
            description: t("tables.userAccessDescription"),
        },
        {
            key: "excel-upload",
            label: t("nav.excelUpload"),
            description: t("excel.pageDescription"),
        },
    ];
    const navSections = [
        {
            id: "dashboard",
            label: t("nav.home"),
            items: [{ id: "home", label: t("nav.home") }],
        },
        {
            id: "tables",
            label: t("nav.tablesSection"),
            items: [{ id: "companies", label: t("nav.companies") }],
        },
        {
            id: "masters",
            label: t("nav.mastersSection"),
            items: [
                { id: "master-products", label: t("nav.masterProducts") },
                { id: "master-agents", label: t("nav.masterAgents") },
            ],
        },
        {
            id: "mappings",
            label: t("nav.mappingsSection"),
            items: [
                { id: "products-per-company", label: t("nav.productsPerCompany") },
                { id: "agents-per-company", label: t("nav.agentsPerCompany") },
            ],
        },
        {
            id: "access",
            label: t("nav.accessSection"),
            items: [{ id: "user-access", label: t("nav.userAccess") }],
        },
        {
            id: "imports",
            label: t("nav.importsSection"),
            items: [{ id: "excel-upload", label: t("nav.excelUpload") }],
        },
    ];
    const pageBreadcrumbs = {
        home: [t("nav.home")],
        companies: [t("nav.tablesSection"), t("nav.companies")],
        "master-products": [t("nav.mastersSection"), t("nav.masterProducts")],
        "master-agents": [t("nav.mastersSection"), t("nav.masterAgents")],
        "products-per-company": [t("nav.mappingsSection"), t("nav.productsPerCompany")],
        "agents-per-company": [t("nav.mappingsSection"), t("nav.agentsPerCompany")],
        "user-access": [t("nav.accessSection"), t("nav.userAccess")],
        "excel-upload": [t("nav.importsSection"), t("nav.excelUpload")],
    };
    useEffect(() => {
        setSearchQuery("");
    }, [currentPage]);
    const loadCompanyDetailData = async () => {
        try {
            const results = await Promise.allSettled([
                productsPerCompanyApi.list(),
                agentsPerCompanyApi.list(),
                masterProductsApi.list(),
                masterAgentsApi.list(),
            ]);
            const resolve = (result) => (result.status === "fulfilled" ? result.value || [] : []);
            setProductsPerCompany(resolve(results[0]));
            setAgentsPerCompany(resolve(results[1]));
            setMasterProducts(resolve(results[2]));
            setMasterAgents(resolve(results[3]));
        }
        catch {
            // Detail drawer can still render without linked data.
        }
    };
    useEffect(() => {
        if (drawerPage === "companies") {
            setProductMappingForm({ master_product_code: "", company_product_name: "" });
            setAgentMappingForm({ master_agent_code: "", master_product_code: "", comments: "" });
        }
    }, [drawerItem, drawerPage]);
    const handleView = (page, item) => {
        setDrawerPage(page);
        setDrawerItem(item);
        if (page === "companies" || page === "master-products" || page === "master-agents") {
            loadCompanyDetailData();
        }
    };
    const closeDrawer = (open) => {
        if (!open) {
            setDrawerItem(null);
            setDrawerPage(null);
        }
    };
    const handleAddCompanyProduct = async () => {
        if (!drawerItem) return;
        if (!productMappingForm.master_product_code || !productMappingForm.company_product_name) return;
        setIsSaving(true);
        try {
            await productsPerCompanyApi.create({
                company_code: drawerItem.company_code,
                master_product_code: productMappingForm.master_product_code,
                company_product_name: productMappingForm.company_product_name,
            });
            setProductMappingForm({ master_product_code: "", company_product_name: "" });
            await loadCompanyDetailData();
            toast.success(t("toasts.productLinkAdded"));
        }
        catch (error) {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productLinkAddFailed") + details);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleDeleteCompanyProductMapping = async (product) => {
        if (!product?.id) return;
        if (!window.confirm(t("common.confirmDelete"))) return;
        setIsSaving(true);
        try {
            await productsPerCompanyApi.remove(product.id);
            await loadCompanyDetailData();
            toast.success(t("toasts.productLinkDeleted"));
        }
        catch (error) {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.productLinkDeleteFailed") + details);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleAddCompanyAgent = async () => {
        if (!drawerItem) return;
        if (!agentMappingForm.master_agent_code || !agentMappingForm.master_product_code) return;
        setIsSaving(true);
        try {
            await agentsPerCompanyApi.create({
                company_code: drawerItem.company_code,
                master_agent_code: agentMappingForm.master_agent_code,
                master_product_code: agentMappingForm.master_product_code,
                comments: agentMappingForm.comments,
            });
            setAgentMappingForm({ master_agent_code: "", master_product_code: "", comments: "" });
            await loadCompanyDetailData();
            toast.success(t("toasts.agentAssignmentAdded"));
        }
        catch (error) {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentAssignmentAddFailed") + details);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleDeleteCompanyAgentMapping = async (agent) => {
        if (!agent?.id) return;
        if (!window.confirm(t("common.confirmDelete"))) return;
        setIsSaving(true);
        try {
            await agentsPerCompanyApi.remove(agent.id);
            await loadCompanyDetailData();
            toast.success(t("toasts.agentAssignmentDeleted"));
        }
        catch (error) {
            const details = error?.message ? ` ${error.message}` : "";
            toast.error(t("toasts.agentAssignmentDeleteFailed") + details);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleHomeAddCompany = () => {
        setEditingItem(null);
        setCurrentPage("companies");
        setIsAddDialogOpen(true);
    };
    const handleHomeImport = () => {
        setCurrentPage("excel-upload");
    };
    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return (<HomePage pages={homePages} onNavigate={setCurrentPage} onAddCompany={handleHomeAddCompany} onImport={handleHomeImport} stats={homeStats} lastUpdated={mergedLastUpdated} />);
            case "companies":
                return (<>
            <GenericTablePage title={t("tables.companiesTitle")} description={t("tables.companiesDescription")} columns={companyColumns} data={companies} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onView={(item) => handleView("companies", item)} onDelete={handleDeleteCompany} getItemId={(item) => item.company_code} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel} searchQuery={searchQuery} selectedId={drawerPage === "companies" ? drawerItem?.company_code : null}/>
            <CompanyFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddCompany} mode="add"/>
            {editingItem && (<CompanyFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditCompany} mode="edit" initialData={editingItem}/>)}
          </>);
            case "master-products":
                return (<>
            <GenericTablePage title={t("tables.masterProductsTitle")} description={t("tables.masterProductsDescription")} columns={masterProductColumns} data={masterProducts} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onView={(item) => handleView("master-products", item)} onDelete={handleDeleteMasterProduct} getItemId={(item) => item.master_product_code} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel} searchQuery={searchQuery} selectedId={drawerPage === "master-products" ? drawerItem?.master_product_code : null}/>
            <MasterProductFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddMasterProduct} mode="add"/>
            {editingItem && (<MasterProductFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditMasterProduct} mode="edit" initialData={editingItem}/>)}
          </>);
            case "master-agents":
                return (<>
            <GenericTablePage title={t("tables.masterAgentsTitle")} description={t("tables.masterAgentsDescription")} columns={masterAgentColumns} data={masterAgents} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onView={(item) => handleView("master-agents", item)} onDelete={handleDeleteMasterAgent} getItemId={(item) => item.master_agent_code} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel} searchQuery={searchQuery} selectedId={drawerPage === "master-agents" ? drawerItem?.master_agent_code : null}/>
            <MasterAgentFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddMasterAgent} mode="add"/>
            {editingItem && (<MasterAgentFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditMasterAgent} mode="edit" initialData={editingItem}/>)}
          </>);
            case "products-per-company":
                return (<>
            <GenericTablePage title={t("tables.productsPerCompanyTitle")} description={t("tables.productsPerCompanyDescription")} columns={productPerCompanyColumns} data={normalizedProductsPerCompany} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onView={(item) => handleView("products-per-company", item)} onDelete={handleDeleteProductPerCompany} getItemId={(item) => item.id} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel} searchQuery={searchQuery} selectedId={drawerPage === "products-per-company" ? drawerItem?.id : null}/>
            <ProductPerCompanyFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddProductPerCompany} mode="add" companies={companies} masterProducts={masterProducts}/>
            {editingItem && (<ProductPerCompanyFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditProductPerCompany} mode="edit" initialData={editingItem} companies={companies} masterProducts={masterProducts}/>)}
          </>);
            case "agents-per-company":
                return (<>
            <GenericTablePage title={t("tables.agentsPerCompanyTitle")} description={t("tables.agentsPerCompanyDescription")} columns={agentPerCompanyColumns} data={normalizedAgentsPerCompany} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onView={(item) => handleView("agents-per-company", item)} onDelete={handleDeleteAgentPerCompany} getItemId={(item) => item.id} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel} searchQuery={searchQuery} selectedId={drawerPage === "agents-per-company" ? drawerItem?.id : null}/>
            <AgentPerCompanyFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddAgentPerCompany} mode="add" companies={companies} masterAgents={masterAgents} masterProducts={masterProducts} productsPerCompany={productsPerCompany}/>
            {editingItem && (<AgentPerCompanyFormDialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} onSave={handleEditAgentPerCompany} mode="edit" initialData={editingItem} companies={companies} masterAgents={masterAgents} masterProducts={masterProducts} productsPerCompany={productsPerCompany}/>)}
          </>);
            case "user-access":
                return (<>
            <GenericTablePage title={t("tables.userAccessTitle")} description={t("tables.userAccessDescription")} columns={userAccessColumns} data={userAccess} onAdd={() => setIsAddDialogOpen(true)} onEdit={setEditingItem} onView={(item) => handleView("user-access", item)} onDelete={handleDeleteUserAccess} getItemId={(item) => item.id} isLoading={isLoading} isSaving={isSaving} onDownloadExcel={handleDownloadExcel} searchQuery={searchQuery} selectedId={drawerPage === "user-access" ? drawerItem?.id : null}/>
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
    const drawerColumnsMap = {
        companies: companyColumns,
        "master-products": masterProductColumns,
        "master-agents": masterAgentColumns,
        "products-per-company": productPerCompanyColumns,
        "agents-per-company": agentPerCompanyColumns,
        "user-access": userAccessColumns,
    };
    const drawerTitleMap = {
        companies: t("tables.companiesTitle"),
        "master-products": t("tables.masterProductsTitle"),
        "master-agents": t("tables.masterAgentsTitle"),
        "products-per-company": t("tables.productsPerCompanyTitle"),
        "agents-per-company": t("tables.agentsPerCompanyTitle"),
        "user-access": t("tables.userAccessTitle"),
    };
    const masterProductMap = new Map(masterProducts.map((product) => [product.master_product_code, product.master_product_name]));
    const masterAgentMap = new Map(masterAgents.map((agent) => [agent.master_agent_code, agent.full_agent_name]));
    const companyLinkedContent = (() => {
        if (!drawerItem) return null;
        const companyProducts = productsPerCompany.filter((product) => product.company_code === drawerItem.company_code);
        const companyAgents = agentsPerCompany.filter((agent) => agent.company_code === drawerItem.company_code);
        return (
            <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">{t("drawer.productsTab")}</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500">
                                {t("drawer.selectMasterProduct")} <span className="text-rose-500">*</span>
                            </label>
                            <SearchableSelect
                                value={productMappingForm.master_product_code}
                                onChange={(value) => setProductMappingForm((prev) => ({ ...prev, master_product_code: value }))}
                                options={masterProducts.map((product) => ({
                                    value: product.master_product_code,
                                    label: product.master_product_name || product.master_product_code,
                                    subLabel: product.master_product_code,
                                    searchValue: `${product.master_product_name || ""} ${product.master_product_code || ""}`.trim(),
                                }))}
                                placeholder={t("drawer.selectMasterProduct")}
                                emptyText={t("common.noResults")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500">
                                {t("drawer.companyProductName")} <span className="text-rose-500">*</span>
                            </label>
                            <input
                                value={productMappingForm.company_product_name}
                                onChange={(event) => setProductMappingForm((prev) => ({ ...prev, company_product_name: event.target.value }))}
                                placeholder={t("drawer.companyProductName")}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddCompanyProduct}
                            disabled={isSaving}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 md:col-span-2"
                        >
                            {t("drawer.addMapping")}
                        </button>
                    </div>
                    <div className="mt-4 divide-y divide-slate-100">
                        {companyProducts.length ? (
                            companyProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between gap-4 py-2 text-sm text-slate-700">
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {product.master_product?.master_product_name ||
                                                masterProductMap.get(product.master_product_code) ||
                                                product.master_product_code}
                                        </div>
                                        <div className="text-xs text-slate-500">{product.company_product_name}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-xs text-slate-400">
                                        <span>{product.master_product_code}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCompanyProductMapping(product)}
                                            disabled={isSaving}
                                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60"
                                        >
                                            {t("common.delete")}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-3 text-sm text-slate-500">{t("drawer.noMappings")}</div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">{t("drawer.agentsTab")}</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500">
                                {t("drawer.selectMasterAgent")} <span className="text-rose-500">*</span>
                            </label>
                            <SearchableSelect
                                value={agentMappingForm.master_agent_code}
                                onChange={(value) => setAgentMappingForm((prev) => ({ ...prev, master_agent_code: value }))}
                                options={masterAgents.map((agent) => ({
                                    value: agent.master_agent_code,
                                    label: agent.full_agent_name || agent.master_agent_code,
                                    subLabel: agent.master_agent_code,
                                    searchValue: `${agent.full_agent_name || ""} ${agent.master_agent_code || ""}`.trim(),
                                }))}
                                placeholder={t("drawer.selectMasterAgent")}
                                emptyText={t("common.noResults")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500">
                                {t("drawer.selectMasterProduct")} <span className="text-rose-500">*</span>
                            </label>
                            <SearchableSelect
                                value={agentMappingForm.master_product_code}
                                onChange={(value) => setAgentMappingForm((prev) => ({ ...prev, master_product_code: value }))}
                                options={masterProducts.map((product) => ({
                                    value: product.master_product_code,
                                    label: product.master_product_name || product.master_product_code,
                                    subLabel: product.master_product_code,
                                    searchValue: `${product.master_product_name || ""} ${product.master_product_code || ""}`.trim(),
                                }))}
                                placeholder={t("drawer.selectMasterProduct")}
                                emptyText={t("common.noResults")}
                            />
                        </div>
                        <input
                            value={agentMappingForm.comments}
                            onChange={(event) => setAgentMappingForm((prev) => ({ ...prev, comments: event.target.value }))}
                            placeholder={t("drawer.comments")}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleAddCompanyAgent}
                            disabled={isSaving}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 md:col-span-2"
                        >
                            {t("drawer.addMapping")}
                        </button>
                    </div>
                    <div className="mt-4 divide-y divide-slate-100">
                        {companyAgents.length ? (
                            companyAgents.map((agent) => (
                                <div key={agent.id} className="flex items-center justify-between gap-4 py-2 text-sm text-slate-700">
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {agent.master_agent?.full_agent_name ||
                                                masterAgentMap.get(agent.master_agent_code) ||
                                                agent.master_agent_code}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {agent.master_product?.master_product_name ||
                                                masterProductMap.get(agent.master_product_code) ||
                                                agent.master_product_code}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-xs text-slate-400">
                                        <span>{agent.comments || "-"}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCompanyAgentMapping(agent)}
                                            disabled={isSaving}
                                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60"
                                        >
                                            {t("common.delete")}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-3 text-sm text-slate-500">{t("drawer.noMappings")}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    })();
    const masterProductLinkedContent = (() => {
        if (!drawerItem) return null;
        const linkedCompanies = productsPerCompany.filter((product) => product.master_product_code === drawerItem.master_product_code);
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">{t("drawer.linkedCompanies")}</div>
                <div className="mt-4 divide-y divide-slate-100">
                    {linkedCompanies.length ? (
                        linkedCompanies.map((product) => (
                            <div key={product.id} className="flex items-center justify-between gap-4 py-2 text-sm text-slate-700">
                                <div>
                                    <div className="font-semibold text-slate-800">
                                        {product.company?.company_name || product.company_name || product.company_code}
                                    </div>
                                    <div className="text-xs text-slate-500">{product.company_product_name}</div>
                                </div>
                                <div className="text-xs text-slate-400">{product.company_code}</div>
                            </div>
                        ))
                    ) : (
                        <div className="py-3 text-sm text-slate-500">{t("drawer.noMappings")}</div>
                    )}
                </div>
            </div>
        );
    })();
    const masterAgentLinkedContent = (() => {
        if (!drawerItem) return null;
        const linkedCompanies = agentsPerCompany.filter((agent) => agent.master_agent_code === drawerItem.master_agent_code);
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">{t("drawer.linkedCompanies")}</div>
                <div className="mt-4 divide-y divide-slate-100">
                    {linkedCompanies.length ? (
                        linkedCompanies.map((agent) => (
                            <div key={agent.id} className="flex items-center justify-between gap-4 py-2 text-sm text-slate-700">
                                <div>
                                    <div className="font-semibold text-slate-800">
                                        {agent.company?.company_name || agent.company_name || agent.company_code}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {agent.master_product?.master_product_name ||
                                            masterProductMap.get(agent.master_product_code) ||
                                            agent.master_product_code}
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400">{agent.company_code}</div>
                            </div>
                        ))
                    ) : (
                        <div className="py-3 text-sm text-slate-500">{t("drawer.noMappings")}</div>
                    )}
                </div>
            </div>
        );
    })();
    const resolveUserName = (user) => {
        if (!user) return null;
        return user.full_name || user.email || user.id || null;
    };
    const historyFields = drawerItem
        ? [
              { label: t("columns.created"), value: drawerItem.created_at },
              { label: t("columns.updated"), value: drawerItem.updated_at },
              { label: t("columns.createdBy"), value: resolveUserName(drawerItem.created_by_user) || drawerItem.created_by },
              { label: t("columns.updatedBy"), value: resolveUserName(drawerItem.updated_by_user) || drawerItem.updated_by },
          ].filter((field) => field.value)
        : [];
    return (
        <AppShell
            navSections={navSections}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            userEmail={userEmail}
            onLogout={onLogout}
            breadcrumb={pageBreadcrumbs[currentPage] || [t("nav.home")]}
            searchQuery={currentPage === "home" || currentPage === "excel-upload" ? undefined : searchQuery}
            onSearchChange={currentPage === "home" || currentPage === "excel-upload" ? undefined : setSearchQuery}
            hideSidebar={currentPage === "home"}
        >
            {renderPage()}
            <RecordDrawer
                open={!!drawerItem}
                onOpenChange={closeDrawer}
                title={drawerTitleMap[drawerPage] || ""}
                columns={drawerPage ? drawerColumnsMap[drawerPage] || [] : []}
                item={drawerItem}
                linkedContent={
                    drawerPage === "companies"
                        ? companyLinkedContent
                        : drawerPage === "master-products"
                        ? masterProductLinkedContent
                        : drawerPage === "master-agents"
                        ? masterAgentLinkedContent
                        : null
                }
                historyFields={historyFields}
                onEdit={
                    drawerItem
                        ? () => {
                              setEditingItem(drawerItem);
                              setDrawerItem(null);
                              setDrawerPage(null);
                          }
                        : null
                }
            />
        </AppShell>
    );
}
