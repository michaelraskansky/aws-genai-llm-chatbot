# Changes Documentation: Main vs GovChatbot Branch

| **Category** | **Functionality** | **Files Changed** | **What Was Changed** | **Impact** |
|--------------|-------------------|-------------------|---------------------|------------|
| **UI Localization** | Hebrew Language Support | Multiple React components | All UI text translated from English to Hebrew | Complete Hebrew interface |
| **UI Localization** | File Upload Dialog | `file-dialog.tsx` | Error messages: "Please choose a file" → "נא לבחור קובץ", "File size or type is invalid" → "גודל או סוג הקובץ אינו תקין" | Hebrew file upload experience |
| **UI Localization** | Navigation Panel | `navigation-panel.tsx` | Menu items translated: "Playground" → "צ'אטבוט", "Sessions" → "הסטוריה", "Models" → "מודלים" | Hebrew navigation |
| **UI Localization** | Session Management | `sessions.tsx` | Labels translated: "New session" → "הפעלה חדשה", "Delete" → "מחק", "Refresh" → "רענן" | Hebrew session interface |
| **UI Localization** | Models Page | `models/column-definitions.tsx` | Column headers: "Provider" → "ספק", "Name" → "שם", "RAG Supported" → "תומך RAG" | Hebrew models interface |
| **UI Localization** | RAG Dashboard | `rag/dashboard/` components | Labels: "Dashboard" → "לוח בקרה", "Workspaces" → "סביבות עבודה", "Documents" → "מסמכים" | Hebrew RAG interface |
| **UI Localization** | Welcome Page | `welcome.tsx` | Complete page translation including descriptions and feature explanations | Hebrew welcome experience |
| **UI Localization** | Global Header | `global-header.tsx` | App title changed to "צ'אטבוט עברי", theme toggle: "Light Mode"/"Dark Mode" → "מצב בהיר"/"מצב חשוך" | Hebrew header |
| **RTL Support** | Right-to-Left Layout | `chat.module.scss` | Added `direction: rtl;` to chat container | RTL text direction |
| **RTL Support** | Global Layout | `global-header.tsx` | Added `dir="rtl"` attribute to main container | RTL page layout |
| **RTL Support** | Chat Interface Positioning | `chat.module.scss` | Changed button positions: `right: 40px` → `left: 58px`, adjusted margins for RTL | RTL chat layout |
| **System Configuration** | Prompt Length Limits | `manage-application.tsx` | Increased character limits from 256 to 1000 for systemPrompt, systemPromptRag, and condenseSystemPrompt | Extended prompt capabilities |
| **System Configuration** | Prompt Validation Regex | `manage-application.tsx` | Updated regex from `/^[A-Za-z0-9-_., !?]*$/` to `/^[A-Za-z0-9-_., !?\n\r[\]();:#]*$/` | More flexible prompt input |
| **Application Architecture** | Chat Layout System | `types.ts` | Added `ChatLayout` enum with `Application = "chat_app_container"` and `Chatbot = "chat_container"` | Application-specific layouts |
| **Application Architecture** | Application Routing | `application.tsx` | Added conditional rendering based on `chatLayout` prop and `applicationId` parameter | Multi-application support |
| **Application Architecture** | Navigation Logic | `navigation-panel.tsx` | Added application-specific navigation paths using `applicationId` parameter | Context-aware navigation |
| **Infrastructure** | Configuration Parameters | `config-util.ts` | Added: `enableWaf: true`, `enableS3TransferAcceleration: true`, `caCerts: ""`, `cloudfrontLogBucketArn: ""` | Additional config options |
| **Model Interfaces** | IDEFICS File Handling | `idefics/adapters/base.py` | Added fallback for null MIME types, added `map_mime_type_to_file_type` method | Better file type detection |
| **Model Interfaces** | IDEFICS Logging | `idefics/adapters/base.py` | Modified logging to omit messages from stream params for security | Improved logging |
| **Model Interfaces** | Langchain Imports | `idefics/` Python files | Updated imports from `langchain.llms` to `langchain_community.llms` | Updated dependencies |
| **Infrastructure** | Lambda Layer Support | Multiple CDK files | Added conditional CA certificate layer support | Certificate support |
| **Infrastructure** | GraphQL Permissions | `idefics/index.ts` | Added `props.graphqlApi.grantMutation(requestHandler)` | GraphQL mutation permissions |
| **Infrastructure** | Provisioned Concurrency | `idefics/index.ts` | Added conditional provisioned concurrency support with alias creation | Performance optimization |
| **Infrastructure** | Direct Send Configuration | `idefics/index.ts` | Added `DIRECT_SEND` environment variable based on config | Message routing options |
| **Monitoring** | Region Comment | `monitoring/index.ts` | Added comment about us-east-1 region requirement | Documentation |
| **Assets** | Hebrew Demo | `docs/about/assets/chatbot-demo-hebrew.gif` | Added Hebrew interface demonstration GIF | Visual documentation |
| **Assets** | Custom Logo | `public/images/custom_logo.svg` | Added custom branding logo file | Brand customization |
| **Assets** | Localization Files | `public/all.en.json`, `custom_messages.json` | Added localization resource files | I18n support |
| **Assets** | Theme Configuration | `public/theme.json` | Added theme configuration file | Custom styling |
| **Documentation** | README Updates | `README.md` | Added Hebrew support documentation and demo GIF reference | Updated project description |
| **Development Tools** | User Management Script | `scripts/tools.sh` | Added `update_user_default_application` function | Admin utilities |
| **Development Tools** | Package Scripts | `package.json` | Added `"set-user-default-application-id"` npm script | Development workflow |
| **Development Tools** | Version Management | `.tool-versions` | Added version specification file | Development environment |
| **Testing** | Authentication Tests | `autentication-construct.test.ts` | Updated test to include `shared` parameter in Authentication constructor | Test compatibility |
| **Testing** | API Tests | `chatbot-api-construct.test.ts` | Reordered constructor parameters: moved `shared` before `authentication` | Test compatibility |
