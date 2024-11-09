import {
  Box,
  Button,
  Form,
  Select,
  FormField,
  Input,
  Modal,
  SpaceBetween,
  Toggle,
  SelectProps,
} from "@cloudscape-design/components";
import { useForm } from "../../common/hooks/use-form";
import { ChatBotConfiguration, ChatInputState } from "./types";
import { Dispatch, useContext } from "react";
import { ChatInputPanelProps} from "./chat-input-panel";
import { OptionsHelper } from "../../common/helpers/options-helper";
import { StorageHelper } from "../../common/helpers/storage-helper";
import { getSelectedModelMetadata } from "./utils";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../common/app-context";

export interface ConfigDialogProps {
  sessionId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  configuration: ChatBotConfiguration;
  setConfiguration: Dispatch<React.SetStateAction<ChatBotConfiguration>>;
  setChatInputState: Dispatch<React.SetStateAction<ChatInputState>>;
  chatInputPanelProps: ChatInputPanelProps;
  chatInputState: ChatInputState;
  workspaceDefaultOptions: SelectProps.Option[];
  isAdmin: boolean;
}

interface ChatConfigDialogData {
  streaming: boolean;
  showMetadata: boolean;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export default function ConfigDialog(props: ConfigDialogProps) {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const { data, onChange, errors, validate } = useForm<ChatConfigDialogData>({
    initialValue: () => {
      const retValue = {
        streaming: props.configuration.streaming,
        showMetadata: props.configuration.showMetadata,
        maxTokens: props.configuration.maxTokens,
        temperature: props.configuration.temperature,
        topP: props.configuration.topP,
      };

      return retValue;
    },
    validate: (form) => {
      const errors: Record<string, string | string[]> = {};

      if (form.temperature < 0 || form.temperature > 1.0) {
        errors.temperature = "Temperature must be between 0 and 1.0";
      }

      return errors;
    },
  });

  const saveConfig = () => {
    if (!validate()) return;

    props.setConfiguration({
      ...props.configuration,
      ...data,
    });

    props.setVisible(false);
  };

  const cancelChanges = () => {
    onChange({
      ...props.configuration,
      streaming: props.configuration.streaming,
      showMetadata: props.configuration.showMetadata,
      temperature: props.configuration.temperature,
      maxTokens: props.configuration.maxTokens,
      topP: props.configuration.topP,
    });

    props.setVisible(false);
  };

  const modelsOptions = OptionsHelper.getSelectOptionGroups(props.chatInputState.models ?? []);
  const adminOptions = (props.isAdmin)
  ? 
    [
      {
        label: "Create new workspace",
        value: "__create__",
        iconName: "add-plus" as const,
      },
    ]
  : [];

  const workspaceOptions = [
    ...props.workspaceDefaultOptions,
    ...adminOptions,
    ...OptionsHelper.getSelectOptions(props.chatInputState.workspaces ?? []),
  ];

  return (
    <Modal
      onDismiss={() => props.setVisible(false)}
      visible={props.visible}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Button variant="link" onClick={cancelChanges}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveConfig}>
              Save changes
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Configuration"
    >
      <Form>
        <SpaceBetween size="m">
          <FormField label="Session Id">{props.sessionId}</FormField>
          <FormField label="Streaming" errorText={errors.streaming}>
            <Toggle
              checked={data.streaming}
              onChange={({ detail: { checked } }) =>
                onChange({ streaming: checked })
              }
            >
              Enabled (if supported by the model)
            </Toggle>
          </FormField>
          <FormField label="Metadata" errorText={errors.showMetadata}>
            <Toggle
              checked={data.showMetadata}
              onChange={({ detail: { checked } }) =>
                onChange({ showMetadata: checked })
              }
            >
              Show metadata
            </Toggle>
          </FormField>
          <FormField
            label="Max Tokens"
            errorText={errors.maxTokens}
            description="This is the maximum number of tokens that the LLM generates. The higher the number, the longer the response. This is strictly related to the target model."
          >
            <Input
              type="number"
              step={1}
              value={data.maxTokens.toString()}
              onChange={({ detail: { value } }) => {
                onChange({ maxTokens: parseInt(value) });
              }}
            />
          </FormField>
          <FormField
            label="Temperature"
            errorText={errors.temperature}
            description="A higher temperature setting usually results in a more varied and inventive output, but it may also raise the chances of deviating from the topic."
          >
            <Input
              type="number"
              step={0.05}
              value={data.temperature.toFixed(2)}
              onChange={({ detail: { value } }) => {
                let floatVal = parseFloat(value);
                floatVal = Math.min(1.0, Math.max(0.0, floatVal));

                onChange({ temperature: floatVal });
              }}
            />
          </FormField>
          <FormField
            label="Top-P"
            errorText={errors.topP}
            description="Top-P picks from the top tokens based on the sum of their probabilities. Also known as nucleus sampling, is another hyperparameter that controls the randomness of language model output. This method can produce more diverse and interesting output than traditional methods that randomly sample the entire vocabulary."
          >
            <Input
              type="number"
              step={0.1}
              value={data.topP.toFixed(2)}
              onChange={({ detail: { value } }) => {
                let floatVal = parseFloat(value);
                floatVal = Math.min(1.0, Math.max(0.0, floatVal));

                onChange({ topP: floatVal });
              }}
            />
          </FormField>
          <FormField
          label="Large Language Model"
          description="choose large language mode you want to use."
        >
        <Select
            disabled={props.chatInputPanelProps.running}
            data-locator="select-model"
            statusType={props.chatInputState.modelsStatus}
            loadingText="Loading models (might take few seconds)..."
            placeholder="Select a model"
            empty={
              <div>
                No models available. Please make sure you have access to Amazon
                Bedrock or alternatively deploy a self hosted model on SageMaker
                or add API_KEY to Secrets Manager
              </div>
            }
            filteringType="auto"
            selectedOption={props.chatInputState.selectedModel}
            onChange={({ detail }) => {
              props.setChatInputState((state) => ({
                ...state,
                selectedModel: detail.selectedOption,
                selectedModelMetadata: getSelectedModelMetadata(
                  state.models,
                  detail.selectedOption
                ),
              }));
              if (detail.selectedOption?.value) {
                StorageHelper.setSelectedLLM(detail.selectedOption.value);
              }
            }}
            options={modelsOptions}
          />
          </FormField>
          <FormField
            label="Workspace"
            description="choose workspace"
          >
          {appContext?.config.rag_enabled && (
            <Select
              disabled={
                props.chatInputPanelProps.running || !props.chatInputState.selectedModelMetadata?.ragSupported
              }
              loadingText="Loading workspaces (might take few seconds)..."
              statusType={props.chatInputState.workspacesStatus}
              placeholder="Select a workspace (RAG data source)"
              filteringType="auto"
              selectedOption={props.chatInputState.selectedWorkspace}
              options={workspaceOptions}
              onChange={({ detail }) => {
                if (detail.selectedOption?.value === "__create__") {
                  navigate("/rag/workspaces/create");
                } else {
                  props.setChatInputState((state) => ({
                    ...state,
                    selectedWorkspace: detail.selectedOption,
                  }));

                  StorageHelper.setSelectedWorkspaceId(
                    detail.selectedOption?.value ?? ""
                  );
                }
              }}
              empty={"No Workspaces available"}
            />
          )}
        </FormField>
        </SpaceBetween>
      </Form>
    </Modal>
  );
}
