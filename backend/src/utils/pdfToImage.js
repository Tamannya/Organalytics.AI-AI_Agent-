import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export const convertPdfToImage = async (pdfPath, outputPath) => {
  const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');
  const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;

  // Tiny HTML wrapper with pdf.js to render page 1 to a canvas
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
</head>
<body style="margin: 0; padding: 0;">
  <canvas id="pdf-canvas"></canvas>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    
    async function renderPDF(pdfUrl) {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 }); // 2.0 for higher clarity
        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport }).promise;
        document.body.setAttribute('data-status', 'ready');
      } catch (err) {
        console.error("PDF.js render error:", err);
        document.body.setAttribute('data-status', 'error');
        document.body.setAttribute('data-error', err.message);
      }
    }
  </script>
</body>
</html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    // Call the render function with the pdf data URL
    await page.evaluate((url) => {
      window.renderPDF(url);
    }, pdfDataUrl);

    // Wait for PDF rendering to finish or fail
    await page.waitForFunction(() => {
      const status = document.body.getAttribute('data-status');
      return status === 'ready' || status === 'error';
    }, { timeout: 15000 });

    const status = await page.evaluate(() => document.body.getAttribute('data-status'));
    if (status === 'error') {
      const errMsg = await page.evaluate(() => document.body.getAttribute('data-error'));
      throw new Error(errMsg || "pdf.js failed to render PDF page");
    }

    // Capture the canvas element as a PNG screenshot
    const canvas = await page.$('#pdf-canvas');
    if (!canvas) {
      throw new Error("Canvas element not found in Puppeteer page");
    }
    await canvas.screenshot({ path: outputPath });
  } finally {
    await browser.close();
  }
};
