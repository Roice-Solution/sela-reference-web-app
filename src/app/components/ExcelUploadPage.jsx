import { UploadCloud } from "lucide-react";
import { useId } from "react";
import { useI18n } from "../i18n/i18n";
import { PageHeader } from "./PageHeader";

export function ExcelUploadPage({
  tables,
  onDownloadTemplate,
  onFileSelected,
  pendingUploads,
  onConfirmUpload,
  onCancelUpload,
  isSaving,
}) {
  const { t } = useI18n();
  const fileInputId = useId();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("excel.pageTitle")} description={t("excel.pageDescription")} />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("excel.importTitle")}
                </h3>
                <p className="text-sm text-slate-600">
                  {t("excel.importSubtitle")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={onDownloadTemplate}
                className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t("excel.template")}
              </button>
              <label
                htmlFor={fileInputId}
                className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
              >
                {t("excel.upload")}
              </label>
              <input
                id={fileInputId}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    onFileSelected(file);
                  }
                  event.target.value = "";
                }}
              />
            </div>
          </div>

          <div className="p-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {t("excel.supportedTables")}
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tables.map((table) => (
                <div
                  key={table.key}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="text-sm font-semibold text-slate-800">
                    {table.label}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {table.sheetName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {pendingUploads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-bold text-slate-900">
                {t("excel.confirmTitle")}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {t("excel.confirmSubtitle", {
                  count: pendingUploads.totalRows,
                })}
              </p>
            </div>
            <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
              {pendingUploads.tables.map((table) => (
                <div key={table.key} className="rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-800">
                      {table.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t("excel.rowsCount", { count: table.rows.length })}
                    </div>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <table className="min-w-[520px] w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase text-slate-500">
                          {table.headers.map((header) => (
                            <th key={header.key} className="pb-2 pr-4">
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.slice(0, 5).map((row, idx) => (
                          <tr key={`${table.key}-${idx}`} className="border-t border-slate-100">
                            {table.headers.map((header) => (
                              <td
                                key={header.key}
                                className="py-2 pr-4 text-slate-700"
                              >
                                {row[header.key] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={onCancelUpload}
                className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={onConfirmUpload}
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {t("excel.confirmButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
