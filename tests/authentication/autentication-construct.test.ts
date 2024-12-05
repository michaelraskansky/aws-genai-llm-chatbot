import { App, Stack } from "aws-cdk-lib";
import { Authentication } from "../../lib/authentication";
import { getTestConfig } from "../utils/config-util";
import { Template } from "aws-cdk-lib/assertions";
import { Shared } from "../../lib/shared";

const app = new App();
const stack = new Stack(app);
const config = getTestConfig();
const shared = new Shared(stack, "Shared", { config });

new Authentication(stack, "AuthenticationConstruct", getTestConfig(), shared);

test("snapshot test", () => {
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});
