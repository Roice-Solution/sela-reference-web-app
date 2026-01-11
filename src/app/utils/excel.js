import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

const DATA_VALIDATION_ROWS = 1000;
const EXCEL_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const mapHeaderIndexes = (headerRow, headerSpecs) => {
  const indexMap = {};
  const normalized = headerRow.map(normalizeHeader);
  const specMap = new Map();
  headerSpecs.forEach((spec) => {
    specMap.set(normalizeHeader(spec.label), spec.key);
    specMap.set(normalizeHeader(spec.key), spec.key);
  });
  normalized.forEach((header, index) => {
    const key = specMap.get(header);
    if (key) {
      indexMap[index] = key;
    }
  });
  return indexMap;
};

const columnIndexToLetter = (index) => {
  let value = index + 1;
  let letters = "";
  while (value > 0) {
    const modulo = (value - 1) % 26;
    letters = String.fromCharCode(65 + modulo) + letters;
    value = Math.floor((value - 1) / 26);
  }
  return letters;
};

const applyDataValidations = (worksheet, headerSpecs, maxRows = DATA_VALIDATION_ROWS) => {
  headerSpecs.forEach((spec, index) => {
    if (!spec.allowedValues || spec.allowedValues.length === 0) return;
    const column = columnIndexToLetter(index);
    const range = `${column}2:${column}${maxRows}`;
    const escaped = spec.allowedValues
      .map((value) => String(value).replace(/"/g, '""'))
      .join(",");
    worksheet.dataValidations.add(range, {
      type: "list",
      allowBlank: true,
      showInputMessage: true,
      showErrorMessage: true,
      formulae: [`"${escaped}"`],
    });
  });
};

const triggerDownload = (buffer, fileName) => {
  const blob = new Blob([buffer], { type: EXCEL_MIME_TYPE });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const readExcelFile = async (file, headerSpecs) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
  return parseSheetRows(rows, headerSpecs);
};

export const readExcelWorkbook = async (file) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheets = {};
  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    sheets[sheetName] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
    });
  });
  return sheets;
};

export const parseSheetRows = (rows, headerSpecs) => {
  if (!rows || !rows.length) {
    return [];
  }
  const headerRow = rows[0];
  const indexMap = mapHeaderIndexes(headerRow, headerSpecs);
  const specByKey = new Map(
    headerSpecs.map((spec) => [spec.key, spec])
  );
  const dataRows = rows.slice(1);
  const data = [];
  const errors = [];
  dataRows.forEach((row) => {
    const record = {};
    Object.entries(indexMap).forEach(([index, key]) => {
      const value = row[Number(index)];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        const spec = specByKey.get(key);
        const normalizedValue = String(value).trim();
        if (spec?.allowedValues?.length) {
          const matched = spec.allowedValues.find(
            (allowed) => String(allowed).toLowerCase() === normalizedValue.toLowerCase()
          );
          if (!matched) {
            errors.push(
              `Row ${data.length + 2}: ${spec.label || key} "${normalizedValue}" is invalid (allowed: ${spec.allowedValues.join(", ")})`
            );
            return;
          }
          record[key] = matched;
          return;
        }
        record[key] = value;
      }
    });
    if (Object.keys(record).length > 0) {
      data.push(record);
    }
  });
  if (errors.length) {
    const preview = errors.slice(0, 5).join("; ");
    const suffix = errors.length > 5 ? ` (+${errors.length - 5} more)` : "";
    throw new Error(`Excel validation failed. ${preview}${suffix}`);
  }
  return data;
};

export const downloadExcelTemplate = async ({ fileName, sheetName, headerSpecs }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName || "Template");
  worksheet.addRow(headerSpecs.map((spec) => spec.label));
  applyDataValidations(worksheet, headerSpecs);
  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, `${fileName}-template.xlsx`);
};

export const downloadExcelTemplateWorkbook = async ({ fileName, sheets }) => {
  const workbook = new ExcelJS.Workbook();
  sheets.forEach((sheet) => {
    const worksheet = workbook.addWorksheet(sheet.sheetName);
    worksheet.addRow(sheet.headerSpecs.map((spec) => spec.label));
    applyDataValidations(worksheet, sheet.headerSpecs);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, `${fileName}-template.xlsx`);
};

export const downloadExcelData = ({ fileName, sheetName, headerSpecs, data }) => {
  const headerRow = headerSpecs.map((spec) => spec.label);
  const rows = data.map((item) =>
    headerSpecs.map((spec) => (item[spec.key] ?? ""))
  );
  const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Export");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
