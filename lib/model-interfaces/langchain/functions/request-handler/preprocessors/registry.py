import os
import importlib
import importlib.util
from typing import Dict, Optional
from aws_lambda_powertools import Logger
from preprocessors.base_preprocessor import BasePreprocessor

logger = Logger()


class PreprocessorRegistry:
    """Registry for managing document preprocessors with auto-discovery."""
    
    def __init__(self):
        self.preprocessors: Dict[str, BasePreprocessor] = {}
        self.logger = logger
        self._discover_preprocessors()
    
    def _discover_preprocessors(self):
        """Auto-discover and register all preprocessors in the package."""
        try:
            current_dir = os.path.dirname(__file__)
            
            # Security: Validate directory exists and is readable
            if not os.path.exists(current_dir) or not os.access(current_dir, os.R_OK):
                self.logger.error(f"Cannot access preprocessors directory: {current_dir}")
                return
            
            for filename in os.listdir(current_dir):
                if filename.endswith('_preprocessor.py') and filename != 'base_preprocessor.py':
                    # Security: Validate filename to prevent path traversal
                    if not filename.replace('_', '').replace('.', '').isalnum():
                        self.logger.warning(f"Skipping invalid filename: {filename}")
                        continue
                        
                    module_name = filename[:-3]  # Remove .py extension
                    try:
                        # Import the module dynamically
                        module_path = os.path.join(current_dir, filename)
                        spec = importlib.util.spec_from_file_location(module_name, module_path)
                        if spec is None or spec.loader is None:
                            self.logger.error(f"Cannot load spec for {module_name}")
                            continue
                            
                        module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(module)
                        
                        # Find preprocessor classes
                        for attr_name in dir(module):
                            if attr_name.startswith('_'):  # Skip private attributes
                                continue
                                
                            attr = getattr(module, attr_name)
                            if (isinstance(attr, type) and 
                                issubclass(attr, BasePreprocessor) and 
                                attr != BasePreprocessor):
                                
                                # Create instance and register if enabled
                                try:
                                    preprocessor = attr()
                                    if preprocessor.is_enabled():
                                        for ext in preprocessor.get_supported_extensions():
                                            self.register_preprocessor(ext, preprocessor)
                                        
                                        self.logger.info(f"Auto-registered preprocessor: {attr_name}",
                                                       extensions=preprocessor.get_supported_extensions())
                                    else:
                                        self.logger.info(f"Preprocessor disabled: {attr_name}")
                                except Exception as e:
                                    self.logger.error(f"Failed to instantiate {attr_name}: {str(e)}")
                                    
                    except Exception as e:
                        self.logger.error(f"Failed to load preprocessor module {module_name}: {str(e)}")
                        
        except Exception as e:
            self.logger.error(f"Failed to discover preprocessors: {str(e)}")
    
    def register_preprocessor(self, file_extension: str, preprocessor: BasePreprocessor):
        """Register a preprocessor for a specific file extension."""
        file_extension = file_extension.lower().replace(".", "")
        self.preprocessors[file_extension] = preprocessor
        self.logger.debug(f"Registered preprocessor for {file_extension}", 
                        processor=preprocessor.__class__.__name__)
    
    def get_preprocessor(self, file_extension: str) -> Optional[BasePreprocessor]:
        """Get preprocessor for a file extension."""
        file_extension = file_extension.lower().replace(".", "")
        return self.preprocessors.get(file_extension)
    
    def get_preprocessor_for_file(self, filename: str) -> Optional[BasePreprocessor]:
        """Get preprocessor based on filename."""
        if not filename or "." not in filename:
            return None
        
        file_extension = filename.split(".")[-1].lower()
        return self.get_preprocessor(file_extension)
