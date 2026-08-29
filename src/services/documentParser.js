/**
 * Document Parser Service
 * Handles client-side extraction of text from PDF, DOCX, and TXT/MD files.
 */
import * as mammoth from 'mammoth';

// Configure PDF.js worker gracefully
let pdfjsLib = null;

async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  try {
    const pdfjs = await import('pdfjs-dist');
    // Configure worker
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '4.5.136'}/pdf.worker.min.mjs`;
    }
    pdfjsLib = pdfjs;
    return pdfjsLib;
  } catch (err) {
    console.warn('Local pdfjs-dist import fallback to CDN:', err);
    // Fallback to window CDN if needed
    if (window.pdfjsLib) {
      pdfjsLib = window.pdfjsLib;
      return pdfjsLib;
    }
    throw new Error('PDF parsing library failed to initialize: ' + err.message);
  }
}

/**
 * Parses an uploaded file into plain text with progress reporting
 * @param {File} file - The uploaded File object
 * @param {Function} onProgress - Progress reporting callback (statusMessage, percent)
 * @returns {Promise<{ text: string, fileName: string, fileType: string, pageCount?: number }>}
 */
export async function parseDocument(file, onProgress = () => {}) {
  if (!file) throw new Error('No file provided for parsing.');

  const fileName = file.name;
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';

  onProgress('Reading file data...', 15);

  if (fileExt === 'pdf') {
    return await parsePdfFile(file, onProgress);
  } else if (fileExt === 'docx') {
    return await parseDocxFile(file, onProgress);
  } else if (['txt', 'md', 'rtf', 'text'].includes(fileExt)) {
    return await parseTextFile(file, onProgress);
  } else {
    // Try text read as general fallback
    try {
      const text = await file.text();
      if (text && text.trim().length > 20) {
        onProgress('File extracted successfully', 100);
        return { text: cleanExtractedText(text), fileName, fileType: fileExt || 'text' };
      }
    } catch {
      // ignore
    }
    throw new Error(`Unsupported file format (.${fileExt}). Please upload a PDF, DOCX, or TXT file.`);
  }
}

/**
 * Extracts plain text from a PDF file page by page
 */
async function parsePdfFile(file, onProgress) {
  onProgress('Loading PDF document...', 25);
  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    isEvalSupported: false
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  let fullText = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(30 + (pageNum / numPages) * 60);
    onProgress(`Extracting text from page ${pageNum} of ${numPages}...`, percent);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ');

    fullText += `\n--- [Page ${pageNum}] ---\n` + pageText;
  }

  const cleanedText = cleanExtractedText(fullText);
  if (!cleanedText || cleanedText.length < 30) {
    throw new Error('The uploaded PDF appears to be empty, scanned as images only, or password protected without readable text.');
  }

  onProgress('PDF text extraction complete', 100);
  return {
    text: cleanedText,
    fileName: file.name,
    fileType: 'pdf',
    pageCount: numPages
  };
}

/**
 * Extracts plain text from a DOCX file using mammoth
 */
async function parseDocxFile(file, onProgress) {
  onProgress('Extracting Word document structure...', 40);
  const arrayBuffer = await file.arrayBuffer();
  
  const result = await mammoth.extractRawText({ arrayBuffer });
  const cleanedText = cleanExtractedText(result.value);

  if (!cleanedText || cleanedText.length < 30) {
    throw new Error('The DOCX file appears to have no readable text content.');
  }

  onProgress('Word document extracted', 100);
  return {
    text: cleanedText,
    fileName: file.name,
    fileType: 'docx'
  };
}

/**
 * Reads plain text or markdown files directly
 */
async function parseTextFile(file, onProgress) {
  onProgress('Reading plain text file...', 50);
  const rawText = await file.text();
  const cleanedText = cleanExtractedText(rawText);

  if (!cleanedText || cleanedText.length < 15) {
    throw new Error('The text file is empty.');
  }

  onProgress('Text file extracted', 100);
  return {
    text: cleanedText,
    fileName: file.name,
    fileType: 'txt'
  };
}

/**
 * Cleans extracted text to remove excessive whitespace and noise
 */
function cleanExtractedText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}
