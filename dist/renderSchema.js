import { toAllUpper, toUpper } from "./toUpper";
export const renderSchema = (schema, trans) => {
    const list = [];
    schema === null || schema === void 0 ? void 0 : schema.map((r) => {
        var _a, _b;
        if ((_a = r === null || r === void 0 ? void 0 : r.role) === null || _a === void 0 ? void 0 : _a.min) {
            list.push({
                condition: [`!min:${r.name}:${r.role.min}`],
                fields: [
                    {
                        name: r.name,
                        error: trans(`${trans(r.title)} ${trans("is less than")} ${r.role.min} character(s)`),
                    },
                ],
            });
        }
        if ((_b = r === null || r === void 0 ? void 0 : r.role) === null || _b === void 0 ? void 0 : _b.max) {
            list.push({
                condition: [`!max:${r.name}:${r.role.max}`],
                fields: [
                    {
                        name: r.name,
                        error: trans(`${trans(r.title)} ${trans("is more than")} ${r.role.min} character(s)`),
                    },
                ],
            });
        }
        if (r === null || r === void 0 ? void 0 : r.regexp) {
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
export const renderManipulate = (result, manipulate) => {
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
