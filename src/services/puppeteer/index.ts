import puppeteer, { PDFOptions } from "puppeteer";
import { getHtmlOutput, uploadFileStream } from "@/services";

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

  const pdfFile = await page.pdf({
    printBackground: true,
    margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
    ...(!options?.width && !options?.height && { format: "A4" }),
    ...options,
  });

  uploadFileStream(outputPdfPath, Buffer.from(pdfFile));

  await browser.close();
}
