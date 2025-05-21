import { FormSchema } from "./types";

type SchemaType = { [key: string]: (data: any) => FormSchema[] };

export const adminSchema: SchemaType = {
  changeProfile: (data?: any) => [
    {
      type: "text",
      name: "name",
      title: "full name",
      value: data?.name || "",
      manipulate: ["allUpper"],
      required: true,
      role: { min: 3, max: 90 },
    },
    {
      type: "text",
      name: "email",
      title: "email",
      regexp: "email",
      placeholder: data?.username || "",
      value: "",
      //stopChange: true,
    },
    {
      type: "password",
      name: "password",
      title: "previous password",
      role: { min: 5, max: 80 },
      value: "",
    },
    {
      type: "password",
      name: "new_password",
      title: "new password",
      role: { min: 5, max: 80 },
      value: "",
    },
  ],
};

export const clientSchema: SchemaType = {};
