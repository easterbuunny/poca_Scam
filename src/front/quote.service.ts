import { Injectable } from "@nestjs/common";
import { Quote } from '../api/quote/quote.entity';
const PDFDocument = require('pdfkit');

const max_width = 612;
const max_height = 792;

const company = {
    'address' : '5 avenue Anatole France',
    'city' : '75007 PARIS',
    'mail' : 'contact@scam.com',
    'name' : 'Société de Crédit d\'Assurance Méritocratique',
    'phone' : '01 13 37 19 84'
};

const ORIGIN_TEXT = "Document officiel émanant de la Société de Crédit d'Assurance Méritocratique©.\n"
const LEGAL_TEXT = "Les données entrées dans notre site web sont conservées et pourront être utilisées à des fins commerciales ou d'études statistiques. Pour plus d'informations concernant l'utilisation de ces informations, consultez la page 'Conditions d'utilisation' disponible sur notre site web.";

const QUOTE_TEXT = ORIGIN_TEXT + "Ce document est purement informatif, et le montant de la prime affiché peut ne plus être d'actualité si le devis délivré n'est plus en accord avec les nouvelles modalités de création de contrat.\n" + LEGAL_TEXT;
const CONTRACT_TEXT = ORIGIN_TEXT + "Ce document a valeur de contrat, et le montant de la prime affiché ne peut être modifié.\n" + LEGAL_TEXT;


@Injectable()
export class QuoteService {
    async generatePDF(data: Quote, is_contract : boolean ): Promise<Buffer>
    {
        
        const pdfBuffer: Buffer = await new Promise(resolve=>{
            const doc = new PDFDocument(
                {
                   size: "LETTER",
                   bufferPages: true
                }
            )

            const today = new Date();
            const date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            // Title
            {
                const xinit = 40;
                const yinit = 30;
                const cell_height = 100;

                doc.image('public/images/logoScam.png', xinit, yinit, {width: cell_height});
                doc.font('Courier-Bold');
                doc.fontSize(15);
                doc.text("ASSURANCES SCAM", cell_height + xinit + 20, yinit + 12);
                doc.text("ÉTUDE PERSONNALISÉE");

                doc.font('Times-Roman');
                doc.fontSize(9);
                const today = new Date();
                doc.text("généré à partir des informations dont vous nous avez informé")
                doc.text("devis délivré le " + date);
            }

            // Entreprise info
            {
                doc.font('Times-Roman')
                doc.fontSize(10);
                doc.lineGap(2);
                doc.text(company['address'], 50, 140);
                doc.text(company['city']);
                doc.text(company['name']);
                doc.text(company['mail']);
                doc.text(company['phone']);

                /*doc.lineWidth(2);
                doc.rect(xinit, yinit, max_width - xinit * 2, cell_height);
                doc.stroke();*/
            }

            
            // User info
            {
                const tab_endx = max_width - 100;
                const first_tabx = 40;
                const second_tabx = 140;
                doc.font('Courier');

                // Contenu
                doc.fontSize(11);
                doc.lineGap(4);

                doc.rect(first_tabx, 220, tab_endx - first_tabx, 122)
                doc.moveTo(second_tabx, 220).lineTo(second_tabx, 342).stroke();

                {
                    doc.text("Nom", first_tabx + 10, 230);
                    doc.text("Email");
                    doc.text("Téléphone");
                    doc.text("Adresse");
                    doc.text("Identifiant");
                }

                {
                    doc.text(data.name, second_tabx + 10, 230);
                    doc.text(data.email);
                    doc.text(data.phone);
                    doc.text(data.address);
                    doc.text(data.token);
                }
                doc.moveTo(40, 315).lineTo(tab_endx, 315).stroke();

                doc.text("Facturation", first_tabx + 10, 325);
                doc.text(data.premium + " €", second_tabx + 10, 325);
                
                if( is_contract ) {
                    doc.font('Courier');
                    doc.fontSize(12);
                    doc.text("Signé le: " + date, first_tabx, max_height - 400);
                }
            }


            // Footer
            {
                doc.fontSize(8);
                let bottom_text = is_contract ? CONTRACT_TEXT : QUOTE_TEXT;
                doc.text(bottom_text, 40, max_height - 300);
                doc.moveDown();
            }

            const buffer = []
            doc.on('data',buffer.push.bind(buffer))
            doc.on('end', () => {
                const data = Buffer.concat(buffer)
                resolve(data)
            })
            doc.end()
        })
        return pdfBuffer;

    }
}