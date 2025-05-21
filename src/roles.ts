import { RolesType } from "./types";

export const adminRoles: RolesType = {
  changeProfile: [
    {
      condition: ["exist:email", "!exist:password"],
      fields: [{ name: "password", error: "password needed to change email" }],
    },
    {
      condition: ["exist:password", "!exist:email", "!exist:new_password"],
      fields: [
        {
          name: "new_password",
          error: "password set but new password is not exist",
        },
      ],
    },
    {
      condition: [
        "exist:password",
        "exist:new_password",
        "equal:password|new_password",
      ],
      fields: [
        {
          name: "new_password",
          error: "new password is the same as password",
        },
      ],
    },
  ],
};

export const clientRoles: RolesType = {};
