import { toAllUpper, toUpper } from "./toUpper";
import { FormSchema, ManipulateSchema, Role } from "./types";

export const renderSchema = (schema: FormSchema[], trans: Function) => {
  const list: Role[] = [];
  schema?.map((r) => {
    if (r?.role?.min) {
      list.push({
        condition: [`!min:${r.name}:${r.role.min}`],
        fields: [
          {
            name: r.name,
            error: trans(
              `${trans(r.title)} ${trans("is less than")} ${
                r.role.min
              } character(s)`
            ),
          },
        ],
      });
    }
    if (r?.role?.max) {
      list.push({
        condition: [`!max:${r.name}:${r.role.max}`],
        fields: [
          {
            name: r.name,
            error: trans(
              `${trans(r.title)} ${trans("is more than")} ${
                r.role.min
              } character(s)`
            ),
          },
        ],
      });
    }
    if (r?.regexp) {
      switch (r.regexp) {
        case "email":
          list.push({
            condition: [
              `!regexp:${r.name}:/^[a-zA-Z0-9._]+@[^\s@]+\.[a-zA-Z]{2,}$/`,
            ],
            fields: [
              {
                name: r.name,
                error: trans(`${trans(r.title)} ${trans("is not valid")}`),
              },
            ],
          });
      }
    }
  });
};

export const renderManipulate = (
  result: any,
  manipulate: ManipulateSchema[] | undefined
) => {
  let res = result;
  if (manipulate) {
    manipulate.map((r) => {
      switch (r) {
        case "upper":
          res = typeof res === "string" ? toUpper(res) : res;
          break;
        case "allUpper":
          res = typeof res === "string" ? toAllUpper(res) : res;
      }
    });
  }
  return res;
};
