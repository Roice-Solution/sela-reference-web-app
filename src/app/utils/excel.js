import * as XLSX from "xlsx";

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
  const dataRows = rows.slice(1);
  const data = [];
  dataRows.forEach((row) => {
    const record = {};
    Object.entries(indexMap).forEach(([index, key]) => {
      const value = row[Number(index)];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        record[key] = value;
      }
    });
    if (Object.keys(record).length > 0) {
      data.push(record);
    }
  });
  return data;
};

export const downloadExcelTemplate = ({ fileName, sheetName, headerSpecs }) => {
  const headerRow = headerSpecs.map((spec) => spec.label);
  const worksheet = XLSX.utils.aoa_to_sheet([headerRow]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Template");
  XLSX.writeFile(workbook, `${fileName}-template.xlsx`);
};

export const downloadExcelTemplateWorkbook = ({ fileName, sheets }) => {
  const workbook = XLSX.utils.book_new();
  sheets.forEach((sheet) => {
    const headerRow = sheet.headerSpecs.map((spec) => spec.label);
    const worksheet = XLSX.utils.aoa_to_sheet([headerRow]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
  });
  XLSX.writeFile(workbook, `${fileName}-template.xlsx`);
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
