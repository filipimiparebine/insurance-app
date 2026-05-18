import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "pdfmake";
import { uploadToS3 } from "./s3";

const require = createRequire(import.meta.url);
const pdfmakeDir = path.dirname(require.resolve("pdfmake/package.json"));
const robotoDir = path.join(pdfmakeDir, "build", "fonts", "Roboto");

pdfMake.setFonts({
  Roboto: {
    normal: path.join(robotoDir, "Roboto-Regular.ttf"),
    bold: path.join(robotoDir, "Roboto-Medium.ttf"),
    italics: path.join(robotoDir, "Roboto-Italic.ttf"),
    bolditalics: path.join(robotoDir, "Roboto-MediumItalic.ttf"),
  },
});

export async function generatePolicyPdf(params: {
  policyNumber: string;
  insurerName: string;
  ownerName: string;
  vehiclePlate: string;
  startDate: string;
  endDate: string;
  premiumTotal: number;
  currency: string;
  externalPolicyNumber?: string;
}): Promise<{ pdfUrl: string; pdfHash: string }> {
  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    info: {
      title: `Poliță RCA ${params.policyNumber}`,
      author: "blaj.io",
      subject: "Poliță de Asigurare RCA",
    },
    content: [
      {
        text: "Poliță de Asigurare RCA",
        style: "header",
        alignment: "center",
      },
      {
        text: `Seria / Număr: ${params.policyNumber}`,
        style: "subheader",
        alignment: "center",
        margin: [0, 4, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*"],
          body: [
            [
              { text: "Asigurător", style: "label" },
              { text: params.insurerName, style: "value" },
            ],
            [
              { text: "Proprietar", style: "label" },
              { text: params.ownerName, style: "value" },
            ],
            [
              { text: "Vehicul", style: "label" },
              { text: params.vehiclePlate, style: "value" },
            ],
            [
              { text: "Valabilitate", style: "label" },
              { text: `${params.startDate} — ${params.endDate}`, style: "value" },
            ],
            ...(params.externalPolicyNumber
              ? [[
                  { text: "Nr. poliță asigurător", style: "label" },
                  { text: params.externalPolicyNumber, style: "value" },
                ]]
              : []),
            [
              { text: "Prima totală", style: "label" },
              { text: `${params.premiumTotal.toFixed(2)} ${params.currency}`, style: "value" },
            ],
          ],
        },
      },
      {
        text: "Document generat automat. Valabil fără semnătură conform Legii 132/2017.",
        style: "footer",
        alignment: "center",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 11,
        color: "#6b7280",
      },
      label: {
        fontSize: 11,
        bold: true,
        fillColor: "#f9fafb",
        margin: [0, 2, 0, 2],
      },
      value: {
        fontSize: 11,
        margin: [0, 2, 0, 2],
      },
      footer: {
        fontSize: 9,
        color: "#9ca3af",
        margin: [0, 28, 0, 0],
      },
    },
    defaultStyle: {
      font: "Roboto",
    },
  };

  const pdfDoc = pdfMake.createPdf(docDefinition);
  const pdfBuffer = await pdfDoc.getBuffer();

  const key = `policies/${params.policyNumber}.pdf`;
  const pdfUrl = await uploadToS3({
    key,
    body: pdfBuffer,
    contentType: "application/pdf",
  });

  const pdfHash = createHash("sha256").update(pdfBuffer).digest("hex");

  return { pdfUrl, pdfHash };
}
