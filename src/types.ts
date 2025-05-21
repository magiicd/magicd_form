export type ManipulateSchema = "upper" | "allUpper";
export type RoleSchema = { min?: number; max?: number };
export type SizeSchema = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FormSchema = {
  type: "text" | "password";
  value: string;
} & {
  name: string;
  title: string;
  regexp?: "email";
  placeholder?: string;
  stopChange?: boolean;
  manipulate?: ManipulateSchema[];
  required?: boolean;
  role?: RoleSchema;
  size?: SizeSchema;
};
export type ErrorType = { [key: string]: string };

export type Condition = string;
export type FieldError = { name: string; error: string };
export type Role = {
  /**
   * exist , !exist => exist , not exist
   * min:field1:number , !min:number => has minimum number , has not minimum number
   * max:field1:number , !max:number => has maximum number , has not maximum number
   * equal:field1|field2 , !equal:field1|field2 , equality or not
   * regexp:field1:regex , !regexp:field1:regex , check regexp
   * if starts with | , it means error
   */
  condition: string[];
  fields: { name: string; error: string }[];
};

export type Data = Record<string, any>;

export type RolesType = { [key: string]: Role[] };

export type SchemaType = { [key: string]: (data: any) => FormSchema[] };
