# AWS GenAI LLM Chatbot with Hebrew Support

This branch contains targeted modifications to the original AWS GenAI LLM Chatbot project, demonstrating how small changes can significantly customize the chatbot experience for Hebrew and RTL language support.

![sample](docs/about/assets/chatbot-demo-hebrew.gif "AWS GenAI Chatbot")

## Key Customizations

### 1. **RTL Language Support**
- Added right-to-left (RTL) text direction support
- Adjusted UI components for RTL display
- Enables compatibility with Hebrew and other RTL languages

### 2. **Theme Customization**
- Applied Cloudscape design system theming options
- Adjusted color schemes and component styles

### 3. **Extended Regional Deployment**
- Included support for additional AWS regions, such as il-central-1

### 4. **Document Chat Functionality**
- Implemented feature to upload documents
- Use of Amazon Bedrock Converse API, native document support functionality
- Enhances chatbot's utility for document analysis

## Value of Customizations

These modifications showcase the adaptability of the original AWS sample project:

1. **Localization**: RTL support opens up the chatbot to markets using Hebrew and other RTL languages, demonstrating how simple changes can make a product more accessible.

2. **Brand Alignment**: Integrating Cloudscape design elements shows how organizations can easily align the chatbot's look and feel with their brand or preferred design system.

3. **Regional Flexibility**: Adding deployment options for more regions illustrates how organizations can adapt the chatbot to meet local data residency requirements or improve regional performance.

4. **Customization Potential**: These changes serve as practical examples for organizations looking to tailor the chatbot to their specific needs, showing that impactful customization doesn't always require extensive code changes.

5. **Learning Opportunity**: The modification process provides practical insights into adapting Cloudscape components and CDK constructs. This is valuable for developers and organizations looking to customize AWS-based applications and infrastructure.

While these modifications don't fundamentally alter the core functionality, they demonstrate how targeted changes can significantly enhance the chatbot experience.

Enterprise-ready generative AI chatbot with RAG capabilities.

## 🚀 NEW! Support for new Amazon Nova Models 🚀

### Deploy this chatbot to use the recently announced [Amazon Nova models](https://aws.amazon.com/blogs/aws/introducing-amazon-nova-frontier-intelligence-and-industry-leading-price-performance/)!

### These powerful models can **understand** and **generate** images and videos.

Deploy this chatbot to experiment with:

- `Amazon Nova Micro`
- `Amazon Nova Lite`
- `Amazon Nova Pro`
- `Amazon Nova Canvas`
- `Amazon Nova Reels`

Make sure to request access to the new models [here](https://aws-samples.github.io/aws-genai-llm-chatbot/documentation/model-requirements.html#amazon-bedrock-requirements)

## Overview

The AWS GenAI LLM Chatbot is a production-ready solution that enables organizations to deploy a secure, feature-rich chatbot powered by large language models (LLMs) with Retrieval Augmented Generation (RAG) capabilities.

## Key Features

- **Multiple LLM Support**: Amazon Bedrock (Claude, Llama 2), SageMaker, and custom model endpoints
- **Nexus Gateway Integration**: Connect to Nexus Gateway for additional model access
- **Comprehensive RAG Implementation**: Connect to various data sources for context-aware responses
- **Enterprise Security**: Fine-grained access controls, audit logging, and data encryption
- **Conversation Memory**: Full conversation history with persistent storage
- **Web UI and API Access**: Modern React interface and API endpoints for integration
- **Cost Optimization**: Token usage tracking and cost management features
- **Deployment Flexibility**: Multiple deployment options to fit your needs

## Getting Started

This blueprint deploys the complete AWS GenAI LLM Chatbot solution in your AWS account.

### Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured with credentials
- Node.js 18+ and npm
- Python 3.8+
- AWS CDK CLI version compatible with aws-cdk-lib 2.206.0 or later
  ```bash
  # Install or update the CDK CLI globally
  npm install -g aws-cdk@latest
  
  # Verify the installed version
  cdk --version
  ```

> **Important**: The CDK CLI version must be compatible with the aws-cdk-lib version used in this project (currently 2.206.0). If you encounter a "Cloud assembly schema version mismatch" error during deployment, update your CDK CLI to the latest version using the command above.

### Deployment

The deployment process is fully automated using AWS CDK and SeedFarmer.

## Architecture

This solution provides ready-to-use code so you can start **experimenting with a variety of Large Language Models and Multimodal Language Models, settings and prompts** in your own AWS account.

The solution architecture includes:

- Amazon Bedrock for LLM access
- Amazon OpenSearch for vector storage
- Amazon S3 for document storage
- Amazon Cognito for authentication
- AWS Lambda for serverless processing
- Amazon API Gateway for API access
- React-based web interface

## Documentation

For complete documentation, visit the [GitHub repository](https://github.com/aws-samples/aws-genai-llm-chatbot).

## Related Resources

| Resource                                                                                          | Description                                                                                                                                                                                                                                   |
| :------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Secure Messenger GenAI Chatbot](https://github.com/aws-samples/secure-messenger-genai-chatbot)   | A messenger built on Wickr that can interface with this chatbot to provide Q&A service in tightly regulated environments (i.e. HIPAA).                                                                                                        |
| [Project Lakechain](https://github.com/awslabs/project-lakechain)                                 | A powerful cloud-native, AI-powered, document (docs, images, audios, videos) processing framework built on top of the AWS CDK.                                                                                                                |
| [AWS Generative AI CDK Constructs](https://github.com/awslabs/generative-ai-cdk-constructs/)      | Open-source library extension of the [AWS Cloud Development Kit (AWS CDK)](https://docs.aws.amazon.com/cdk/v2/guide/home.html) aimed to help developers build generative AI solutions using pattern-based definitions for their architecture. |
| [Artifacts and Tools for Bedrock](https://github.com/aws-samples/artifacts-and-tools-for-bedrock) | An innovative chat-based user interface with support for tools and artifacts. It can create graphs and diagrams, analyze data, write games, create web pages, generate files, and much more.                                                  |

# Roadmap

Roadmap is available through the [GitHub Project](https://github.com/orgs/aws-samples/projects/69)

# Authors

- [Bigad Soleiman](https://www.linkedin.com/in/bigadsoleiman/)
- [Sergey Pugachev](https://www.linkedin.com/in/spugachev/)

# Contributors

[![contributors](https://contrib.rocks/image?repo=aws-samples/aws-genai-llm-chatbot&max=2000)](https://github.com/aws-samples/aws-genai-llm-chatbot/graphs/contributors)

# License

This library is licensed under the MIT-0 License. See the LICENSE file.

- [Changelog](CHANGELOG.md) of the project.
- [License](LICENSE) of the project.
- [Code of Conduct](CODE_OF_CONDUCT.md) of the project.
- [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

Although this repository is released under the MIT-0 license, its front-end and SQL implementation use the following third party projects:

- [psycopg2-binary](https://github.com/psycopg/psycopg2)
- [jackspeak](https://github.com/isaacs/jackspeak)
- [package-json-from-dist](https://github.com/isaacs/package-json-from-dist)
- [path-scurry](https://github.com/isaacs/path-scurry)

These projects' licensing includes the LGPL v3 and BlueOak-1.0.0 licenses.

# Legal Disclaimer

You should consider doing your own independent assessment before using the content in this sample for production purposes. This may include (amongst other things) testing, securing, and optimizing the content provided in this sample, based on your specific quality control practices and standards.
