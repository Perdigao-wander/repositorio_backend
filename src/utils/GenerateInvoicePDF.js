"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = void 0;
var makeDir = require('make-dir');
var PDFDocument = require('pdfkit');
// @ts-ignore
var fs = require('fs');
var generateInvoicePDF = function (clientData, documentData, invoiceSummary) { return __awaiter(void 0, void 0, void 0, function () {
    var pathFile, doc, nameFile, outputFilePath, logoPath, startY, tableMargin, columnWidths, rowY, detailsY;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pathFile = '../storage/data/invoice/';
                return [4 /*yield*/, makeDir(pathFile)];
            case 1:
                _a.sent();
                doc = new PDFDocument({ size: "A4", margin: 50 });
                nameFile = clientData.clientName + '-' + clientData.policyNumber + '.pdf';
                outputFilePath = pathFile + nameFile;
                doc.pipe(fs.createWriteStream(outputFilePath));
                logoPath = "./logo.jpg";
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
                    .text("N\u00BA Cliente: ".concat(clientData.clientNumber))
                    .text("N\u00BA Cliente: ".concat(clientData.clientName))
                    .text("N\u00BA Ap\u00F3lice: ".concat(clientData.policyNumber))
                    .text("N\u00BA Contribuinte: ".concat(clientData.taxpayerNumber));
                doc.moveDown();
                // Dados do Documento
                doc
                    .fontSize(12)
                    .text("Dados do Seguro:")
                    .moveDown()
                    .text("N\u00BA Fatura \\ Recibo: ".concat(documentData.invoiceNumber))
                    .text("N\u00BA Documento Interno: ".concat(documentData.internalDocNumber))
                    .text("Data de Emiss\u00E3o: ".concat(documentData.issueDate))
                    .text("Per\u00EDodo: ".concat(documentData.period))
                    .text("Fracionamento: ".concat(documentData.fractioning));
                // Linha divisória
                doc.moveTo(260, 260).lineTo(550, 260).stroke();
                // Detalhes da Fatura
                doc.fontSize(12).text("Detalhes da Fatura", 50, 270);
                startY = 300;
                tableMargin = 50;
                columnWidths = [100, 150, 100, 100];
                // Cabeçalhos da tabela
                doc
                    .fontSize(10)
                    .text("Produto", tableMargin, startY)
                    .text("Objeto Seguro", tableMargin + columnWidths[0], startY)
                    .text("Capital", tableMargin + columnWidths[0] + columnWidths[1], startY)
                    .text("Prêmio Total", tableMargin + columnWidths[0] + columnWidths[1] + columnWidths[2], startY);
                rowY = startY + 20;
                doc
                    .text(invoiceSummary.product, tableMargin, rowY)
                    .text(invoiceSummary.insuredObject, tableMargin + columnWidths[0], rowY)
                    .text(invoiceSummary.capital, tableMargin + columnWidths[0] + columnWidths[1], rowY)
                    .text(invoiceSummary.totalPremium, tableMargin + columnWidths[0] + columnWidths[1] + columnWidths[2], rowY);
                // Linha divisória após tabela
                doc.moveTo(50, rowY + 20).lineTo(550, rowY + 20).stroke();
                detailsY = rowY + 40;
                doc
                    .text("Prêmio Antes de Impostos:", 50, detailsY)
                    .text(invoiceSummary.beforeTax, 200, detailsY)
                    .text("Detalhe do Imposto de Selo", 50, detailsY + 20)
                    .text("Base de Incid\u00EAncia: ".concat(invoiceSummary.beforeTax), 70, detailsY + 40)
                    .text("Taxa Imposto: ".concat(invoiceSummary.taxRate), 70, detailsY + 60)
                    .text("Valor Imposto: ".concat(invoiceSummary.taxAmount), 70, detailsY + 80)
                    .text("Outros Encargos e Taxas:", 50, detailsY + 120)
                    .text(invoiceSummary.otherCharges, 200, detailsY + 120)
                    .text("Valor Pago:", 50, detailsY + 140)
                    .fontSize(14)
                    .text(invoiceSummary.totalPaid, 200, detailsY + 140);
                // Observação
                doc
                    .fontSize(10)
                    .text("Isento de IVA (Nº 28 do artº 9º do CIVA); (1) Inclui os seguintes encargos e/ou taxas, quando aplicáveis: Custo com GPCV, FGA, INEM, ANPC e PRP.", 50, detailsY + 180, { align: "left" });
                // Rodapé
                doc
                    .fontSize(10)
                    .text("Desejamos-lhe a continuação de uma boa experiência de seguro!", 50, 750, {
                    align: "center",
                });
                // Finaliza o PDF
                doc.pipe(fs.createWriteStream(outputFilePath));
                doc.end();
                return [2 /*return*/];
        }
    });
}); };
exports.generateInvoicePDF = generateInvoicePDF;
var clientData = {
    clientName: "Wanderley Perdigão",
    clientNumber: "0703339930",
    policyNumber: "7010511832",
    taxpayerNumber: "254554652",
};
var documentData = {
    invoiceNumber: "F201902/0007004",
    internalDocNumber: "7102772716",
    issueDate: "21/03/2019",
    period: "23/03/2019 a 22/06/2019",
    fractioning: "Trimestral",
};
var invoiceSummary = {
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
(0, exports.generateInvoicePDF)(clientData, documentData, invoiceSummary);
