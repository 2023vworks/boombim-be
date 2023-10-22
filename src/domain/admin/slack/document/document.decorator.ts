import { SlackController } from '../slack.controller';

type API_DOC_TYPE = keyof SlackController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  getAction: () => undefined,
};

export const AdminDocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
