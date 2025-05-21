import { renderSchema } from "./renderSchema";
import { Condition, Data, FieldError, FormSchema, Role } from "./types";

const isValidRegex = (regex: string, str: string | null) => {
  let modifiedRegex = regex?.startsWith("/") ? regex.slice(1) : regex;
  modifiedRegex = modifiedRegex?.endsWith("/")
    ? modifiedRegex.slice(0, -1)
    : modifiedRegex;
  const regexp = new RegExp(modifiedRegex);
  return regexp.test(str ? str : "");
};

const checkCondition = (
  schema: FormSchema[],
  condition: Condition,
  data: Data
): boolean => {
  // Remove leading '|' for OR conditions
  if (condition.startsWith("|")) condition = condition.slice(1);

  if (condition.startsWith("!regexp:")) {
    const field = condition.split(":")[1];
    const regexp = condition.split(":")[2];
    if (!schema.find((sc) => sc.name === field)?.required && !data[field]) {
      return false;
    }
    return !isValidRegex(regexp, data[field]);
  }
  if (condition.startsWith("!exist:")) {
    const field = condition.split(":")[1];
    return !data[field];
  }
  if (condition.startsWith("exist:")) {
    const field = condition.split(":")[1];
    return !!data[field];
  }
  if (condition.startsWith("!min:")) {
    const [_, field, num] = condition.split(":");
    if (!schema.find((sc) => sc.name === field)?.required && !data[field]) {
      return false;
    }
    return !(data[field]?.length >= Number(num));
  }
  if (condition.startsWith("min:")) {
    const [_, field, num] = condition.split(":");
    if (!schema.find((sc) => sc.name === field)?.required && !data[field]) {
      return false;
    }
    return data[field]?.length >= Number(num);
  }
  if (condition.startsWith("!max:")) {
    const [_, field, num] = condition.split(":");
    if (!schema.find((sc) => sc.name === field)?.required && !data[field]) {
      return false;
    }
    return !(data[field]?.length <= Number(num));
  }
  if (condition.startsWith("max:")) {
    const [_, field, num] = condition.split(":");
    if (!schema.find((sc) => sc.name === field)?.required && !data[field]) {
      return false;
    }
    return data[field]?.length <= Number(num);
  }
  if (condition.startsWith("!equal:")) {
    const [_, fields] = condition.split(":");
    const [field1, field2] = fields.split("|");
    return data[field1] !== data[field2];
  }
  if (condition.startsWith("equal:")) {
    const [_, fields] = condition.split(":");
    const [field1, field2] = fields.split("|");
    return data[field1] === data[field2];
  }
  // You can add more handlers (e.g., for numbers) as needed
  return false;
};

export const validateRoles = (props: {
  schema: FormSchema[];
  roles: Role[];
  data: Data;
  trans: Function;
}): { [key: string]: string } => {
  const { schema, data, trans } = props;
  const roles = renderSchema({
    roles: props.roles,
    schema,
    trans,
  });
  const errors: FieldError[] = [];
  for (const role of roles) {
    // Separate AND and OR conditions
    const andConditions = role.condition.filter(
      (cond) => !cond.startsWith("|")
    );
    const orConditions = role.condition.filter((cond) => cond.startsWith("|"));

    const andTrue =
      andConditions.length === 0 ||
      andConditions.every((cond) => checkCondition(schema, cond, data));
    const orTrue =
      orConditions.length > 0 &&
      orConditions.some((cond) => checkCondition(schema, cond, data));

    if ((andConditions.length > 0 && andTrue) || orTrue) {
      for (const field of role.fields) {
        if (!errors?.find((err) => err.name === field.name)) {
          errors.push({ name: field.name, error: field.error });
        }
      }
    }
  }
  const errorsJSON: { [key: string]: string } = {};
  errors?.map((err) => {
    errorsJSON[err.name] = err.error;
  });
  return errorsJSON;
};
