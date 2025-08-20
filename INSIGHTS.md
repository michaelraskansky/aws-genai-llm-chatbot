# Project Insights

## Document Preprocessing System

The project now includes a comprehensive document preprocessing system that enhances document analysis capabilities:

### Key Components
- **Base Preprocessor**: Abstract base class for all preprocessors (`base_preprocessor.py`)
- **Registry System**: Auto-discovery and management of preprocessors (`registry.py`)
- **PDF Preprocessor**: Built-in PDF to image conversion using PyMuPDF (`pdf_preprocessor.py`)

### Architecture
- Plugin-based system with auto-discovery
- Environment variable-driven configuration
- Graceful fallback to original documents
- Content block-based output for LLM consumption

### Integration Points
- **ModelAdapter**: Base class now includes preprocessing initialization and methods
- **BedrockChatAdapter**: Enhanced document handling with preprocessing support
- **Requirements**: Added PyMuPDF dependency for PDF processing

### Environment Variables
- `PDF_PREPROCESSING_ENABLED`: Controls PDF preprocessing (default: true)
- Custom preprocessors follow pattern: `{PROCESSOR_NAME}_PREPROCESSING_ENABLED`

### File Structure
```
lib/model-interfaces/langchain/functions/request-handler/
├── preprocessors/
│   ├── __init__.py
│   ├── base_preprocessor.py
│   ├── pdf_preprocessor.py
│   └── registry.py
└── adapters/
    ├── base/base.py (modified)
    └── bedrock/base.py (modified)
```

This system allows for extensible document processing while maintaining backward compatibility.
