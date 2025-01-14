import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { Shared } from "../shared";
import { NagSuppressions } from "cdk-nag";
import { SystemConfig } from "../shared/types";

export interface CognitoPrivateProxyProps {
  readonly shared: Shared;
  readonly config: SystemConfig;
  readonly advancedMonitoring?: boolean;
}

export class CognitoPrivateProxy extends Construct {
  constructor(scope: Construct, id: string, props: CognitoPrivateProxyProps) {
    super(scope, id);

    const { shared } = props;
    const region = cdk.Stack.of(this).region;
    const cognitoEndpoint = `https://cognito-idp.${region}.amazonaws.com`;
    const stack = cdk.Stack.of(this);
    const stackName = stack.stackName;

    const vpcEndpoint = new ec2.InterfaceVpcEndpoint(
      this,
      "ApiGatewayVpcEndpoint",
      {
        vpc: shared.vpc,
        service: new ec2.InterfaceVpcEndpointService(
          `com.amazonaws.${region}.execute-api`
        ),
        subnets: shared.vpcSubnets,
        privateDnsEnabled: true,
      }
    );

    const api = new apigateway.RestApi(this, "CognitoProxyApi", {
      restApiName: "Chatbot Cognito Proxy API",
      defaultCorsPreflightOptions: {
        allowOrigins: ["https://" + props.config.domain],
        allowMethods: ["POST", "OPTIONS"],
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "Cache-Control",
          "X-Amz-Target",
          "X-Amz-User-Agent",
        ],
        allowCredentials: true, // Allow credentials if needed
      },
      endpointConfiguration: {
        types: [apigateway.EndpointType.PRIVATE],
        vpcEndpoints: [vpcEndpoint],
      },
      deployOptions: {
        stageName: "auth",
        metricsEnabled: true,
        tracingEnabled: props.advancedMonitoring || false,
      },
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.AnyPrincipal()],
            actions: ["execute-api:Invoke"],
            resources: ["execute-api:/*"],
            conditions: {
              StringEquals: {
                "aws:SourceVpce": vpcEndpoint.vpcEndpointId,
              },
            },
          }),
        ],
      }),
    });

    // Add methods to the root resource
    api.root.addMethod(
      "POST",
      new apigateway.HttpIntegration(cognitoEndpoint, {
        proxy: true,
        httpMethod: "POST",
        options: {
          requestParameters: {
            "integration.request.header.Authorization":
              "method.request.header.Authorization",
            "integration.request.header.Content-Type":
              "method.request.header.Content-Type",
          },
          passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
          integrationResponses: [
            {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": `'https://${props.config.domain}'`,
                "method.response.header.Access-Control-Allow-Credentials":
                  "'true'",
                "method.response.header.Access-Control-Allow-Headers":
                  "'Content-Type,Authorization,Cache-Control,X-Amz-User-Target,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Methods":
                  "'POST,OPTIONS'",
              },
            },
          ],
        },
      }),
      {
        requestParameters: {
          "method.request.header.Authorization": false,
          "method.request.header.Content-Type": false,
        },
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Credentials": true,
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
          },
        ],
      }
    );

    /*
    const proxyResource = api.root.addResource("{proxy+}");
    // Add the ANY method with corrected integration
    proxyResource.addMethod(
      "ANY",
      new apigateway.HttpIntegration(cognitoEndpoint, {
        options: {
          requestParameters: {
            "integration.request.header.Authorization":
              "method.request.header.Authorization",
            "integration.request.header.Content-Type":
              "method.request.header.Content-Type",
          },
          passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
          integrationResponses: [
            {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin":
                  "https://" + `'${props.config.domain}'`,
                "method.response.header.Access-Control-Allow-Credentials":
                  "'true'",
                "method.response.header.Access-Control-Allow-Headers":
                  "'Content-Type,Authorization,Cache-Control,X-Amz-Target,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Methods":
                  "'GET,POST,OPTIONS,DELETE,PUT'",
              },
            },
            {
              statusCode: "400",
              selectionPattern: "4\\d{2}", // Match any 4xx errors
              responseTemplates: {
                "application/json": JSON.stringify({
                  message: "$input.path('$.errorMessage')",
                }),
              },
            },
            {
              statusCode: "500",
              selectionPattern: "5\\d{2}", // Match any 5xx errors
              responseTemplates: {
                "application/json": JSON.stringify({
                  message: "$input.path('$.errorMessage')",
                }),
              },
            },
          ],
        },
      }),
      {
        requestParameters: {
          "method.request.path.proxy": true,
          "method.request.header.Authorization": false,
          "method.request.header.Content-Type": false,
        },
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Credentials": true,
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
          },
          { statusCode: "400" },
          { statusCode: "500" },
        ],
        requestValidatorOptions: {
          validateRequestBody: true,
          validateRequestParameters: true,
        },
      }
    );
    */

    // Outputs
    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.url,
    });

    new cdk.CfnOutput(this, "VpcEndpointId", {
      value: vpcEndpoint.vpcEndpointId,
    });

    NagSuppressions.addResourceSuppressionsByPath(
      stack,
      [
        `/${stackName}/Customizations/${id}/CognitoProxyApi/Resource`,
        `/${stackName}/Customizations/${id}/CognitoProxyApi/DeploymentStage.auth/Resource`,
        //`/${stackName}/Customizations/${id}/CognitoProxyApi/Default/{proxy+}/ANY/Resource`,
        //`/${stackName}/Customizations/${id}/CognitoProxyApi/Default/{proxy+}/OPTIONS/Resource`,
        `/${stackName}/Customizations/${id}/CognitoProxyApi/Default/OPTIONS/Resource`,
        `/${stackName}/Customizations/${id}/CognitoProxyApi/Default/POST/Resource`,
      ],
      [
        { id: "AwsSolutions-APIG4", reason: "proxy request to cognito" },
        { id: "AwsSolutions-APIG2", reason: "proxy request to cognito" },
        { id: "AwsSolutions-APIG1", reason: "proxy request to cognito" },
        { id: "AwsSolutions-APIG6", reason: "proxy request to cognito" },
        { id: "AwsSolutions-COG4", reason: "proxy request to cognito" },
      ]
    );
  }
}
