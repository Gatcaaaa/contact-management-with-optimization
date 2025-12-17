import path from 'path'
import fs from 'fs-extra'
import handlebars from 'handlebars'
import puppeteer from 'puppeteer'

export class PdfGeneratorService {
  async generateHtml(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(process.cwd(), 'src', 'template', `${templateName}.hbs`)

    const templateHtml = await fs.readFile(templatePath, 'utf-8')

    const template = handlebars.compile(templateHtml)
    return template(data)
  }

  async cratePdfBuffer(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    })

    await browser.close()
    return Buffer.from(pdfBuffer)
  }
}
