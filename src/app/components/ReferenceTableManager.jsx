import { useState } from "react";
import { TopNavigation } from "./TopNavigation";
import { TablePage } from "./TablePage";
import { useI18n } from "../i18n/i18n";
// Mock data for different reference table categories
const initialData = {
    countries: [
        {
            id: "1",
            code: "US",
            description: "United States",
            value: "USA",
            category: "countries",
            status: "active",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
        },
        {
            id: "2",
            code: "UK",
            description: "United Kingdom",
            value: "GBR",
            category: "countries",
            status: "active",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
        },
        {
            id: "3",
            code: "CA",
            description: "Canada",
            value: "CAN",
            category: "countries",
            status: "active",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
        },
    ],
    currencies: [
        {
            id: "4",
            code: "USD",
            description: "US Dollar",
            value: "$",
            category: "currencies",
            status: "active",
            createdAt: "2024-01-16",
            updatedAt: "2024-01-16",
        },
        {
            id: "5",
            code: "EUR",
            description: "Euro",
            value: "€",
            category: "currencies",
            status: "active",
            createdAt: "2024-01-16",
            updatedAt: "2024-01-16",
        },
        {
            id: "6",
            code: "GBP",
            description: "British Pound",
            value: "£",
            category: "currencies",
            status: "active",
            createdAt: "2024-01-16",
            updatedAt: "2024-01-16",
        },
    ],
    departments: [
        {
            id: "7",
            code: "FIN",
            description: "Finance Department",
            value: "Finance",
            category: "departments",
            status: "active",
            createdAt: "2024-01-17",
            updatedAt: "2024-01-17",
        },
        {
            id: "8",
            code: "HR",
            description: "Human Resources",
            value: "HR",
            category: "departments",
            status: "active",
            createdAt: "2024-01-17",
            updatedAt: "2024-01-17",
        },
        {
            id: "9",
            code: "IT",
            description: "Information Technology",
            value: "IT",
            category: "departments",
            status: "active",
            createdAt: "2024-01-17",
            updatedAt: "2024-01-17",
        },
    ],
    status: [
        {
            id: "10",
            code: "ACT",
            description: "Active Status",
            value: "active",
            category: "status",
            status: "active",
            createdAt: "2024-01-18",
            updatedAt: "2024-01-18",
        },
        {
            id: "11",
            code: "INA",
            description: "Inactive Status",
            value: "inactive",
            category: "status",
            status: "active",
            createdAt: "2024-01-18",
            updatedAt: "2024-01-18",
        },
        {
            id: "12",
            code: "PEN",
            description: "Pending Status",
            value: "pending",
            category: "status",
            status: "active",
            createdAt: "2024-01-18",
            updatedAt: "2024-01-18",
        },
    ],
};
export function ReferenceTableManager({ userEmail, onLogout }) {
    const { t } = useI18n();
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState("countries");
    const handleAddEntry = (entry) => {
        const newEntry = {
            ...entry,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
        };
        setData((prev) => ({
            ...prev,
            [currentPage]: [...(prev[currentPage] || []), newEntry],
        }));
    };
    const handleEditEntry = (id, entry) => {
        setData((prev) => ({
            ...prev,
            [currentPage]: (prev[currentPage] || []).map((item) => {
                if (item.id === id) {
                    return {
                        ...entry,
                        id: item.id,
                        createdAt: item.createdAt,
                        updatedAt: new Date().toISOString().split("T")[0],
                    };
                }
                return item;
            }),
        }));
    };
    const handleDeleteEntry = (id) => {
        setData((prev) => ({
            ...prev,
            [currentPage]: (prev[currentPage] || []).filter((item) => item.id !== id),
        }));
    };
    const tablePages = {
        countries: { title: t("tables.countriesTitle"), category: "countries" },
        currencies: { title: t("tables.currenciesTitle"), category: "currencies" },
        departments: { title: t("tables.departmentsTitle"), category: "departments" },
        status: { title: t("tables.statusCodesTitle"), category: "status" },
    };
    const currentTableConfig = tablePages[currentPage];
    return (<div className="min-h-screen bg-gray-50">
      <TopNavigation currentPage={currentPage} onNavigate={setCurrentPage} onLogout={onLogout} userEmail={userEmail}/>
      <TablePage category={currentTableConfig.category} title={currentTableConfig.title} entries={data[currentPage] || []} onAddEntry={handleAddEntry} onEditEntry={handleEditEntry} onDeleteEntry={handleDeleteEntry}/>
    </div>);
}
