import { UploadCloud } from "lucide-react";
import { useId } from "react";
import { useI18n } from "../i18n/i18n";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-6">
          <h2 className="mb-2 text-blue-900">{t("excel.pageTitle")}</h2>
          <p className="text-gray-600">{t("excel.pageDescription")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200">
          <div className="p-6 border-b-2 border-gray-200 bg-blue-50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {t("excel.importTitle")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("excel.importSubtitle")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={onDownloadTemplate}
                className="w-full sm:w-auto rounded-full border-2 border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                {t("excel.template")}
              </button>
              <label
                htmlFor={fileInputId}
                className="w-full sm:w-auto rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white text-center hover:bg-blue-700 cursor-pointer"
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
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {t("excel.supportedTables")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tables.map((table) => (
                <div
                  key={table.key}
                  className="rounded-xl border border-gray-200 p-4 bg-white"
                >
                  <div className="text-sm font-semibold text-gray-800">
                    {table.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {table.sheetName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {pendingUploads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden border-2 border-gray-200">
            <div className="p-6 border-b-2 border-blue-100 bg-blue-50">
              <h3 className="text-lg font-bold text-blue-900">
                {t("excel.confirmTitle")}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t("excel.confirmSubtitle", {
                  count: pendingUploads.totalRows,
                })}
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
              {pendingUploads.tables.map((table) => (
                <div key={table.key} className="border border-gray-200 rounded-xl">
                  <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800">
                      {table.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("excel.rowsCount", { count: table.rows.length })}
                    </div>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <table className="min-w-[520px] w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase">
                          {table.headers.map((header) => (
                            <th key={header.key} className="pb-2 pr-4">
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.slice(0, 5).map((row, idx) => (
                          <tr key={`${table.key}-${idx}`} className="border-t">
                            {table.headers.map((header) => (
                              <td
                                key={header.key}
                                className="py-2 pr-4 text-gray-700"
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
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={onCancelUpload}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={onConfirmUpload}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
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
