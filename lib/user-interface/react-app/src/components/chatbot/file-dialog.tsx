import {
  Box,
  Button,
  FileUpload,
  Form,
  FormField,
  Modal,
  SpaceBetween,
  Spinner,
} from "@cloudscape-design/components";
import { useForm } from "../../common/hooks/use-form";

import { Dispatch, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ChabotInputModality,
  ChatBotConfiguration,
  ChatBotFilesBlob,
  FileStorageProvider,
  SessionFile,
} from "./types";
import { AppContext } from "../../common/app-context";
import { ApiClient } from "../../common/api-client/api-client";
import { FileUploader } from "../../common/file-uploader";
import { Utils } from "../../common/utils";

export interface FileDialogProps {
  sessionId: string;
  header: string;
  maxSize: number;
  modality: ChabotInputModality;
  hint: string;
  allowedTypes: string[];
  hideDialogs: () => void;
  cancel: () => void;
  configuration: ChatBotConfiguration;
  setConfiguration: Dispatch<React.SetStateAction<ChatBotConfiguration>>;
}

export default function FileDialog(props: FileDialogProps) {
  const appContext = useContext(AppContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([] as File[]);

  const { data, onChange, errors, validate } = useForm({
    initialValue: () => {
      const retValue = {
        ...props.configuration,
        files: [] as File[],
      };

      return retValue;
    },
    validate: (form) => {
      const errors: Record<string, string | string[]> | null = {};
      if (!form.files || form.files.length === 0) {
        errors.files = "נא לבחור קובץ";
      }

      if (!validateFiles(form.files)) {
        errors.files = "גודל או סוג הקובץ אינו תקין";
      }

      return errors;
    },
  });

  const saveConfig = async () => {
    if (!validate() || !appContext) return;
    setLoading(true);
    const apiClient = new ApiClient(appContext);

    const files: SessionFile[] = (await uploadFiles(
      data.files,
      apiClient
    )) as SessionFile[];

    const filesBlob: ChatBotFilesBlob = {
      images: props.configuration?.filesBlob?.images,
      documents: props.configuration?.filesBlob?.documents,
      videos: props.configuration?.filesBlob?.videos,
    };
    if (props.modality === ChabotInputModality.Image) {
      filesBlob["images"] = data.files;
    } else if (props.modality === ChabotInputModality.Document) {
      filesBlob["documents"] = data.files;
    } else if (props.modality === ChabotInputModality.Video) {
      filesBlob["videos"] = data.files;
    }

    props.setConfiguration({
      ...props.configuration,
      [props.modality === ChabotInputModality.Image
        ? "images"
        : props.modality === ChabotInputModality.Video
          ? "videos"
          : "documents"]: files,
      filesBlob,
    });
    setFiles([]);
    setLoading(false);
    if (files.length > 0) {
      // Empty when there is an error
      props.hideDialogs();
    }
  };

  const cancelChanges = () => {
    setFiles([]);
    props.cancel();
    setLoading(false);
    props.hideDialogs();
  };

  const validateFiles = (files: File[]) => {
    const maxFilesSizeMb = props.maxSize;
    setError(null);
    if (files.length === 0) return false;

    const errors: string[] = [];
    files.forEach((file) => {
      if (file.size > maxFilesSizeMb * 1024 * 1024) {
        errors.push(`גודל הקובץ חייב להיות קטן מ-${maxFilesSizeMb} מגה-בייט`);
      }

      if (!props.allowedTypes.includes(file.type)) {
        errors.push(
          `סוג הקובץ חייב להיות אחד מהבאים: ${props.allowedTypes.join(", ")}`
        );
      }
    });

    if (errors.length > 0) {
      setError(errors.join(", "));
      return false;
    }

    return true;
  };

  const uploadFiles = async (files: File[], client: ApiClient) => {
    const s3Files = [];
    const uploader = new FileUploader();
    for await (const file of files) {
      try {
        const response = await uploadFile(file, client, uploader);
        s3Files.push({
          key: `${response}`,
          provider: FileStorageProvider.S3,
          type: props.modality, // File type or input modality
        });
      } catch (error) {
        const errorMessage =
          "שגיאה בהעלאת הקובץ: " + Utils.getErrorMessage(error);
        console.log(errorMessage, error);
        setError(errorMessage);
      }
    }

    if (error) {
      return;
    }

    return s3Files;
  };

  const uploadFile = async (
    file: File,
    client: ApiClient,
    uploader: FileUploader
  ) => {
    const id = uuidv4();
    // get the extension of the file and content type
    const extension = file.name.split(".").pop();
    const url = (
      await client.sessions.getFileUploadSignedUrl(`${id}.${extension}`)
    ).data?.getUploadFileURL;
    if (!url) {
      throw new Error("לא ניתן לקבל כתובת להעלאת הקובץ");
    }
    await uploader.upload(file, url, () => {});
    return `${id}.${extension}`;
  };

  return (
    <Modal
      onDismiss={() => props.hideDialogs()}
      visible={true}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Button variant="link" onClick={cancelChanges}>
              ביטול
            </Button>
            <Button
              variant="primary"
              disabled={loading || !files.length}
              onClick={saveConfig}
            >
              הוסף
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={props.header}
    >
      <Form>
        <SpaceBetween size="m">
          <FormField
            label="העלאת קבצים"
            errorText={errors.files}
            description="באפשרותך להעלות תמונות לשימוש בשיחה זו"
          >
            <FileUpload
              onChange={({ detail }) => {
                onChange({ files: detail.value });
                setFiles(detail.value);
              }}
              value={files}
              i18nStrings={{
                uploadButtonText: (e) => (e ? "בחר קבצים" : "בחר קובץ"),
                dropzoneText: (e) => (e ? "גרור קבצים לכאן" : "גרור קובץ לכאן"),
                removeFileAriaLabel: (e) => `הסר קובץ ${e + 1}`,
                limitShowFewer: "הצג פחות",
                limitShowMore: "הצג יותר",
                errorIconAriaLabel: "שגיאה",
              }}
              multiple={true}
              errorText={error}
              showFileThumbnail
              tokenLimit={3}
              constraintText={props.hint}
            />
          </FormField>
          {loading && (
            <>
              <div>
                <Spinner />
                <span style={{ marginRight: "5px" }}>מעלה קובץ...</span>
              </div>
            </>
          )}
        </SpaceBetween>
      </Form>
    </Modal>
  );
}
