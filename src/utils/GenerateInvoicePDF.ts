const makeDir = require('make-dir');
const PDFDocument = require('pdfkit');

// @ts-ignore
const fs = require('fs');

interface ClientData {
    clientName: string;
    clientNumber: string;
    policyNumber: string;
    taxpayerNumber: string;
}

interface DocumentData {
    invoiceNumber: string;
    internalDocNumber: string;
    issueDate: string;
    period: string;
    fractioning: string;
}

interface InvoiceSummary {
    product: string;
    insuredObject: string;
    capital: string;
    totalPremium: string;
    beforeTax: string;
    taxRate: string;
    taxAmount: string;
    otherCharges: string;
    totalPaid: string;
}

export const generateInvoicePDF = async (
    clientData: ClientData,
    documentData: DocumentData,
    invoiceSummary: InvoiceSummary
)=> {

    let pathFile = '../storage/data/invoice/';
    await makeDir(pathFile);


    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const nameFile = clientData.clientName + '-' + clientData.policyNumber +'.pdf';

    const outputFilePath = pathFile + nameFile;



    doc.pipe(fs.createWriteStream(outputFilePath));


    const logoPath = "./logo.jpg";


    // Adiciona o logotipo
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 50, { width: 100 });
    }

    // Título
    doc.fontSize(18).text("FATURA/RECIBO", 400, 50, { align: "right" });

    // Linha divisória
    doc.moveTo(20, 120).lineTo(550, 120).stroke();

    // Dados do Cliente
    doc
        .fontSize(12)
        .text("Dados do Cliente:", 50, 140)
        .moveDown()
        .text(`Nº Cliente: ${clientData.clientNumber}`)
        .text(`Nº Cliente: ${clientData.clientName}`)
        .text(`Nº Apólice: ${clientData.policyNumber}`)
        .text(`Nº Contribuinte: ${clientData.taxpayerNumber}`);
    doc.moveDown()

    // Dados do Documento
    doc
        .fontSize(12)
        .text("Dados do Seguro:")
        .moveDown()
        .text(`Nº Fatura \\ Recibo: ${documentData.invoiceNumber}`)
        .text(`Nº Documento Interno: ${documentData.internalDocNumber}`)
        .text(`Data de Emissão: ${documentData.issueDate}`)
        .text(`Período: ${documentData.period}`)
        .text(`Fracionamento: ${documentData.fractioning}`);

    // Linha divisória
    doc.moveTo(260, 260).lineTo(550, 260).stroke();

    // Detalhes da Fatura
    doc.fontSize(12).text("Detalhes da Fatura", 50, 270);

    // Tabela de resumo
    const startY = 300;
    const tableMargin = 50;
    const columnWidths = [100, 150, 100, 100];

    // Cabeçalhos da tabela
    doc
        .fontSize(10)
        .text("Produto", tableMargin, startY)
        .text("Objeto Seguro", tableMargin + columnWidths[0], startY)
        .text("Capital", tableMargin + columnWidths[0] + columnWidths[1], startY)
        .text("Prêmio Total", tableMargin + columnWidths[0] + columnWidths[1] + columnWidths[2], startY);

    // Linha de dados da tabela
    const rowY = startY + 20;
    doc
        .text(invoiceSummary.product, tableMargin, rowY)
        .text(invoiceSummary.insuredObject, tableMargin + columnWidths[0], rowY)
        .text(invoiceSummary.capital, tableMargin + columnWidths[0] + columnWidths[1], rowY)
        .text(invoiceSummary.totalPremium, tableMargin + columnWidths[0] + columnWidths[1] + columnWidths[2], rowY);

    // Linha divisória após tabela
    doc.moveTo(50, rowY + 20).lineTo(550, rowY + 20).stroke();

    // Detalhes financeiros
    const detailsY = rowY + 40;
    doc
        .text("Prêmio Antes de Impostos:", 50, detailsY)
        .text(invoiceSummary.beforeTax, 200, detailsY)
        .text("Detalhe do Imposto de Selo", 50, detailsY + 20)
        .text(`Base de Incidência: ${invoiceSummary.beforeTax}`, 70, detailsY + 40)
        .text(`Taxa Imposto: ${invoiceSummary.taxRate}`, 70, detailsY + 60)
        .text(`Valor Imposto: ${invoiceSummary.taxAmount}`, 70, detailsY + 80)
        .text("Outros Encargos e Taxas:", 50, detailsY + 120)
        .text(invoiceSummary.otherCharges, 200, detailsY + 120)
        .text("Valor Pago:", 50, detailsY + 140)
        .fontSize(14)
        .text(invoiceSummary.totalPaid, 200, detailsY + 140);

    // Observação
    doc
        .fontSize(10)
        .text(
            "Isento de IVA (Nº 28 do artº 9º do CIVA); (1) Inclui os seguintes encargos e/ou taxas, quando aplicáveis: Custo com GPCV, FGA, INEM, ANPC e PRP.",
            50,
            detailsY + 180,
            { align: "left" }
        );

    // Rodapé
    doc
        .fontSize(10)
        .text("Desejamos-lhe a continuação de uma boa experiência de seguro!", 50, 750, {
            align: "center",
        });

    // Finaliza o PDF
    doc.pipe(fs.createWriteStream(outputFilePath));
    doc.end();
}



const clientData: ClientData = {
    clientName: "Wanderley Perdigão",
    clientNumber: "0703339930",
    policyNumber: "7010511832",
    taxpayerNumber: "254554652",
};

const documentData: DocumentData = {
    invoiceNumber: "F201902/0007004",
    internalDocNumber: "7102772716",
    issueDate: "21/03/2019",
    period: "23/03/2019 a 22/06/2019",
    fractioning: "Trimestral",
};

const invoiceSummary: InvoiceSummary = {
    product: "Light",
    insuredObject: "30-42-EP SEAT IBIZA",
    capital: "7 290 000,00 €",
    totalPremium: "82,01 €",
    beforeTax: "72,22 €",
    taxRate: "9,00%",
    taxAmount: "6,50 €",
    otherCharges: "3,29 €",
    totalPaid: "82,01 €",
};

generateInvoicePDF(clientData, documentData,invoiceSummary);