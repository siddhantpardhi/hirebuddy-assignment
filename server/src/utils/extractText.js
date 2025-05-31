import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export const extractTextFromPdf = async function (filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath))
  const pdfDocument = await pdfjsLib.getDocument({ data }).promise

  const textPromises = []

  for (let i = 1; i <= pdfDocument.numPages; i++) {
    textPromises.push(
      pdfDocument.getPage(i)
        .then(page =>
          page.getTextContent()
            .then(content =>
              content.items.map(item => item.str).join(' ')
            )
        )
    )
  }

  const allPageTexts = await Promise.all(textPromises)
  return allPageTexts.join('\n')
}
