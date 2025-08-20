import os
import fitz  # PyMuPDF
from typing import Dict, Any, List
from preprocessors.base_preprocessor import BasePreprocessor, ProcessedContent


class PDFPreprocessor(BasePreprocessor):
    """PDF preprocessor that converts pages to images using PyMuPDF."""

    def __init__(self):
        super().__init__()
        self.logger.info("PDFPreprocessor initialized")

    def get_supported_extensions(self) -> List[str]:
        """Return list of supported file extensions."""
        return ["pdf"]

    def is_enabled(self) -> bool:
        env_value = os.environ.get("PDF_PREPROCESSING_ENABLED", "true")
        result = env_value.lower() == "true"
        self.logger.info(f"is_enabled() = {result}, env_value = {env_value}")
        return result

    def process(
        self, content: bytes, file_extension: str, metadata: Dict[str, Any] = None
    ) -> ProcessedContent:
        """Process PDF content to convert pages to images."""
        # Security: Validate content size to prevent memory exhaustion
        MAX_PDF_SIZE = 50 * 1024 * 1024  # 50MB limit
        if len(content) > MAX_PDF_SIZE:
            raise ValueError(f"PDF size {len(content)} exceeds maximum allowed size {MAX_PDF_SIZE}")
        
        self.logger.info(f"Starting PDF processing, content size: {len(content)} bytes")
        self._log_processing(file_extension, len(content))

        processed = ProcessedContent()
        processed.add_metadata("processor_name", "PDFPreprocessor")
        processed.add_metadata("original_format", file_extension)

        pdf_doc = None
        try:
            self.logger.info("Opening PDF with PyMuPDF")
            # Open PDF from bytes
            pdf_doc = fitz.open(stream=content, filetype="pdf")
            page_count = pdf_doc.page_count
            
            # Security: Limit number of pages to prevent resource exhaustion
            MAX_PAGES = 100
            if page_count > MAX_PAGES:
                raise ValueError(f"PDF has {page_count} pages, exceeds maximum allowed {MAX_PAGES}")
            
            self.logger.info(f"PDF opened successfully, {page_count} pages")

            # Convert each page to PNG image
            for page_num in range(page_count):
                self.logger.info(f"Processing page {page_num + 1}/{page_count}")
                page = pdf_doc[page_num]
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                img_data = pix.tobytes("png")
                processed.add_image(img_data, "png")
                self.logger.info(
                    f"Page {page_num + 1} converted to PNG: {len(img_data)} bytes"
                )
                pix = None  # Free memory

            processed.add_metadata("images_extracted", page_count)
            self.logger.info(
                f"PDF processing completed successfully, {page_count} images extracted"
            )

        except Exception as e:
            self.logger.error(f"Error processing PDF: {str(e)}")
            processed.add_document(content, file_extension, "original-pdf")
            processed.add_metadata("error", str(e))
        finally:
            # Ensure PDF document is always closed
            if pdf_doc:
                pdf_doc.close()

        return processed
