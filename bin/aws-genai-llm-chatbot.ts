#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { AwsGenAILLMChatbotStack } from "../lib/aws-genai-llm-chatbot-stack";
import { AwsSolutionsChecks } from "cdk-nag";
import { getConfig } from "./config";
import { Aspects } from "aws-cdk-lib";

const app = new cdk.App();

const config = getConfig();
console.log("loaded config: ", JSON.stringify(config, null, 2));
new AwsGenAILLMChatbotStack(app, `${config.prefix}GenAIChatBotStack`, {
  config,
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
