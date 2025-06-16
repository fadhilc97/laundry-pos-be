import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export function getHtmlOutput<D = unknown>(templateName: string, data?: D) {
  const templateFullPath = path.join(
    __dirname,
    `templates/${templateName}.hbs`
  );
  const templateHbs = fs.readFileSync(templateFullPath, "utf-8");
  const template = handlebars.compile(templateHbs);
  const htmlOutput = template(data);

  return htmlOutput;
}
