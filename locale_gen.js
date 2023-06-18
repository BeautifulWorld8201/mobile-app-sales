const fs = require("fs");

function convertExcelToJson(filePath) {
  const fileData = fs.readFileSync(filePath, "utf-8").replace(/\r/g, "");

  const lines = fileData.split("\n");
  const headers = lines[0]
    .replace(/"/g, "")
    .split(",")
    .filter((x) => x !== "");

  const jsonData = headers.reduce((p, n) => {
    p[n] = {};
    return p;
  }, {});

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((x) => x.replace(/"/g, ""));

    for (let j = 0; j < headers.length; j++) {
      jsonData[headers[j]][currentLine[0]] = currentLine[j] || "";
    }
  }
  return jsonData;
}

const write = (data) => {
  Object.keys(data).forEach((key) => {
    fs.writeFileSync(
      `./locales/${key}.json`,
      JSON.stringify(data[key], null, 2),
    );
  });

  const indexFile = Object.keys(data).reduce(
    (p, n) => p + `export { default as ${n} } from "./${n}.json";\n`,
    "",
  );
  fs.writeFileSync("./locales/index.jsx", indexFile);
};

const excelFilePath = "locales.csv";
const json = convertExcelToJson(excelFilePath);

write(json);
