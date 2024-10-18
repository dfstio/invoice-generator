import * as fs from "fs";
import * as Handlebars from "handlebars";
import * as puppeteer from "puppeteer";
import invoiceData from "../data/invoice.json";
async function generateInvoice() {
  // Convert the image to a base64 string
  const signatureImagePath = "./data/Signature.jpeg";
  const signatureImageBase64 = fs.readFileSync(signatureImagePath, "base64");
  const signatureImageDataUrl = `data:image/jpeg;base64,${signatureImageBase64}`;

  // Add the base64 image to the invoice data
  invoiceData.signatureImage = signatureImageDataUrl;

  // Read the template file
  const templateHtml = fs.readFileSync("src/template.html", "utf8");

  // Compile the template
  const template = Handlebars.compile(templateHtml);

  // Generate the HTML with data
  const html = template(invoiceData);

  // Use Puppeteer to generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content to generated HTML
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Generate PDF
  const resultPath = `./result/Invoice-${invoiceData.invoiceNumber}.pdf`;
  await page.pdf({
    path: resultPath,
    format: "A4",
    printBackground: true,
    margin: { top: 0, bottom: 0 }, // Set top and bottom margins to zero
  });

  await browser.close();
  console.log(`PDF Generated: ${resultPath}`);
}

generateInvoice();
