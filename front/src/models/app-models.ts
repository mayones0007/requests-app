
interface IObjectKeys {
  [key: string]: any;
}

export interface SettingsFormField extends IObjectKeys {
  _id?: string,
  name: string,
  code: string,
  description: string,
  type: string,
  required: boolean,
  options: string[] | [],
  defaultValue?: string | boolean | Date,
}

export interface Request {
  [key: string]: any,
}

export interface CreateEditSettingsData {
  form?: SettingsFormField,
  showSelectOptionsPopup: boolean,
  newOption?: string,
}

export interface FormData {
  form?: Request,
  fields?: SettingsFormField[],
}

export interface RequestFormData {
  showForm: boolean,
  showSettings: boolean,
  fields: SettingsFormField[],
  requests: Request[] | [],
  request?: Request,
}

export interface SettingsComponentData {
  showCreateEditPopup: boolean,
  editedField?: SettingsFormField,
  fields?: SettingsFormField[],
}