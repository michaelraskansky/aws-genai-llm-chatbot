# Document Preprocessing

The AWS GenAI LLM Chatbot supports document preprocessing to enhance document analysis capabilities. This feature allows you to transform documents into more suitable formats for LLM processing.

## Overview

Document preprocessing is a plugin-based system that automatically discovers and applies transformations to uploaded documents. Preprocessors can extract text, analyze images, or transform content to make documents more accessible to language models.

## How It Works

1. **Auto-Discovery**: The system automatically finds preprocessor plugins in the `preprocessors/` directory
2. **Conditional Processing**: Each preprocessor can enable/disable itself via environment variables
3. **Content Enhancement**: Preprocessors transform documents into content blocks optimized for LLMs
4. **Fallback Support**: If preprocessing fails, the original document is used

## Built-in Preprocessors

The system includes a PDF preprocessor that extracts text using AWS Textract. Additional preprocessors can be added as plugins.

## Creating Custom Preprocessors

### 1. Create Preprocessor File

Create a new file in `lib/model-interfaces/langchain/functions/request-handler/preprocessors/` with the naming pattern `*_preprocessor.py`:

```python
# example_preprocessor.py
import os
from .base_preprocessor import BasePreprocessor, ProcessedContent

class ExamplePreprocessor(BasePreprocessor):
    def get_supported_extensions(self):
        return ["ext1", "ext2"]  # File extensions without dots
    
    def is_enabled(self):
        return os.environ.get("EXAMPLE_PREPROCESSING_ENABLED", "false").lower() == "true"
    
    def process(self, content: bytes, file_extension: str, metadata=None):
        processed = ProcessedContent()
        
        try:
            # Your custom processing logic here
            result = self.process_document(content, file_extension)
            processed.add_text(f"Processed content:\n{result}")
            processed.add_metadata("processor", "ExamplePreprocessor")
        except Exception as e:
            self.logger.error(f"Processing failed: {str(e)}")
            processed.add_document(content, file_extension, "original-document")
            processed.add_metadata("error", str(e))
        
        return processed
    
    def process_document(self, content: bytes, file_extension: str):
        # Implement your processing logic
        pass
```

### 2. Set Environment Variables

Add environment variables to enable your preprocessor:

```bash
EXAMPLE_PREPROCESSING_ENABLED=true
```

### 3. Deploy

The preprocessor will be automatically discovered and registered when the system starts. No configuration changes needed!

## Base Preprocessor Interface

All preprocessors must inherit from `BasePreprocessor` and implement these methods:

### Required Methods

```python
@abstractmethod
def get_supported_extensions(self) -> List[str]:
    """Return list of supported file extensions (without dots)"""
    pass

@abstractmethod
def is_enabled(self) -> bool:
    """Check if this preprocessor is enabled via configuration"""
    pass

@abstractmethod
def process(self, content: bytes, file_extension: str, metadata=None) -> ProcessedContent:
    """Process the document content and return enhanced content blocks"""
    pass
```

### ProcessedContent API

The `ProcessedContent` class provides methods to build the response:

```python
# Add text content
processed.add_text("Extracted text content")

# Add image content
processed.add_image(image_bytes, "jpeg")

# Add document content
processed.add_document(doc_bytes, "pdf", "document-name")

# Add metadata
processed.add_metadata("key", "value")
```

## Environment Variables

### Custom Preprocessors
Define your own environment variables following the pattern:
- `{PROCESSOR_NAME}_PREPROCESSING_ENABLED` - Enable/disable specific preprocessor

## Troubleshooting

### Preprocessor Not Working

1. **Check specific preprocessor**: Verify preprocessor-specific environment variables
2. **Check logs**: Look for preprocessing initialization and processing logs
3. **Check file naming**: Preprocessor files must end with `_preprocessor.py`

### Custom Preprocessor Issues

1. **Check inheritance**: Must inherit from `BasePreprocessor`
2. **Check method implementation**: All abstract methods must be implemented
3. **Check imports**: Ensure proper imports from base classes
4. **Check error handling**: Add try/catch blocks for robust processing

## Best Practices

1. **Environment-driven configuration**: Use environment variables for enable/disable logic
2. **Graceful fallback**: Always provide fallback to original document
3. **Comprehensive logging**: Log processing steps and errors
4. **Error handling**: Catch and handle processing exceptions
5. **Metadata tracking**: Add useful metadata for debugging and monitoring
6. **Performance consideration**: Consider file size limits and processing time

## Example: Text Extraction Preprocessor

```python
# text_extractor_preprocessor.py
import os
from .base_preprocessor import BasePreprocessor, ProcessedContent

class TextExtractorPreprocessor(BasePreprocessor):
    def get_supported_extensions(self):
        return ["txt", "md", "csv"]
    
    def is_enabled(self):
        return os.environ.get("TEXT_EXTRACTION_ENABLED", "false").lower() == "true"
    
    def process(self, content: bytes, file_extension: str, metadata=None):
        processed = ProcessedContent()
        
        try:
            # Extract text content
            text_content = content.decode('utf-8')
            processed.add_text(f"Text content:\n{text_content}")
            processed.add_metadata("processor", "TextExtractorPreprocessor")
            processed.add_metadata("text_extracted", True)
            
        except Exception as e:
            self.logger.error(f"Text extraction failed: {str(e)}")
            processed.add_document(content, file_extension, "original-document")
            processed.add_metadata("error", str(e))
        
        return processed
```

This creates a simple text extraction preprocessor that handles plain text files.
