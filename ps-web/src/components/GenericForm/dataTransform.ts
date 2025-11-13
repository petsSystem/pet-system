import { TField } from "@interfaces/DynamicForm";

export function transformDataStructure(data: any, fields: TField[]): any {
  const transformedData: any = {};

  fields.forEach((field) => {
    if (field.index === 0) {
      field.fields?.forEach((subField) => {
        transformedData[subField.name] = data[subField.name];
      });
    } else if (field.index === 1) {
      const fieldName = field.name;
      if (!transformedData[fieldName]) {
        transformedData[fieldName] = {};
      }
      field.fields?.forEach((subField) => {
        transformedData[fieldName][subField.name] = data[subField.name];
      });
    }
  });

  return transformedData;
}
