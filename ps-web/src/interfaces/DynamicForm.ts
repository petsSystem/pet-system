export type TField = {
  label: string;
  name: string;
  type: string;
  icon?: JSX.Element;
  disabled?: boolean;
  readonly?: boolean;
  options?: TOption[];
  checkbox?: any;
  fields?: TField[];
  index?: number;
  mask?: string;
};

export type TOption = {
  label: string;
  value: string;
};
