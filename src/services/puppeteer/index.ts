import puppeteer, { PDFOptions } from "puppeteer";
import { getHtmlOutput } from "@/services";

export async function getHtmlToPdf<D = unknown>(
  templateName: string,
  outputPdfPath: string,
  data?: D,
  options?: PDFOptions
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlOutput = getHtmlOutput(templateName, data);
  await page.setContent(htmlOutput);

  await page.pdf({
    path: outputPdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" },
    ...options,
  });

  await browser.close();
}
