from abc import ABC, abstractmethod
from typing import Dict, Any, List
from aws_lambda_powertools import Logger

logger = Logger()


class ProcessedContent:
    """Container for processed document content."""
    
    def __init__(self):
        self.content_blocks: List[Dict[str, Any]] = []
        self.metadata: Dict[str, Any] = {}
    
    def add_text(self, text: str):
        """Add text content block."""
        if text and isinstance(text, str):
            self.content_blocks.append({
                "type": "text",
                "text": text
            })
    
    def add_image(self, image_data: bytes, format: str):
        """Add image content block."""
        if not isinstance(image_data, bytes):
            raise ValueError("Image data must be bytes")
        if not format or not isinstance(format, str):
            raise ValueError("Format must be a non-empty string")
        
        self.content_blocks.append({
            "type": "image",
            "image": {
                "format": format.lower(),
                "source": {"bytes": image_data}
            }
        })
    
    def add_document(self, document_data: bytes, format: str, name: str = "document"):
        """Add document content block."""
        if not isinstance(document_data, bytes):
            raise ValueError("Document data must be bytes")
        if not format or not isinstance(format, str):
            raise ValueError("Format must be a non-empty string")
        if not name or not isinstance(name, str):
            raise ValueError("Name must be a non-empty string")
            
        self.content_blocks.append({
            "type": "document",
            "document": {
                "format": format.lower(),
                "name": name,
                "source": {"bytes": document_data}
            }
        })
    
    def add_metadata(self, key: str, value: Any):
        """Add metadata."""
        if not key or not isinstance(key, str):
            raise ValueError("Metadata key must be a non-empty string")
        self.metadata[key] = value


class BasePreprocessor(ABC):
    """Abstract base class for document preprocessors."""
    
    def __init__(self):
        self.logger = logger
    
    @abstractmethod
    def get_supported_extensions(self) -> List[str]:
        """Return list of supported file extensions."""
        pass
    
    @abstractmethod
    def is_enabled(self) -> bool:
        """Check if this preprocessor is enabled via configuration."""
        pass
    
    @abstractmethod
    def process(self, content: bytes, file_extension: str, metadata: Dict[str, Any] = None) -> ProcessedContent:
        """Process the document content and return enhanced content blocks."""
        pass
    
    def _log_processing(self, file_extension: str, content_size: int):
        """Log preprocessing activity."""
        self.logger.info(
            f"Processing {file_extension} file",
            file_type=file_extension,
            content_size=content_size,
            processor=self.__class__.__name__
        )
