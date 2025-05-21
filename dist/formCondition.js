const isValidRegex = (regex, str) => {
    let modifiedRegex = (regex === null || regex === void 0 ? void 0 : regex.startsWith("/")) ? regex.slice(1) : regex;
    modifiedRegex = (modifiedRegex === null || modifiedRegex === void 0 ? void 0 : modifiedRegex.endsWith("/"))
        ? modifiedRegex.slice(0, -1)
        : modifiedRegex;
    const regexp = new RegExp(modifiedRegex);
    return regexp.test(str ? str : "");
};
const checkCondition = (schema, condition, data) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Remove leading '|' for OR conditions
    if (condition.startsWith("|"))
        condition = condition.slice(1);
    if (condition.startsWith("!regexp:")) {
        const field = condition.split(":")[1];
        const regexp = condition.split(":")[2];
        if (!((_a = schema.find((sc) => sc.name === field)) === null || _a === void 0 ? void 0 : _a.required) && !data[field]) {
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
        if (!((_b = schema.find((sc) => sc.name === field)) === null || _b === void 0 ? void 0 : _b.required) && !data[field]) {
            return false;
        }
        return !(((_c = data[field]) === null || _c === void 0 ? void 0 : _c.length) >= Number(num));
    }
    if (condition.startsWith("min:")) {
        const [_, field, num] = condition.split(":");
        if (!((_d = schema.find((sc) => sc.name === field)) === null || _d === void 0 ? void 0 : _d.required) && !data[field]) {
            return false;
        }
        return ((_e = data[field]) === null || _e === void 0 ? void 0 : _e.length) >= Number(num);
    }
    if (condition.startsWith("!max:")) {
        const [_, field, num] = condition.split(":");
        if (!((_f = schema.find((sc) => sc.name === field)) === null || _f === void 0 ? void 0 : _f.required) && !data[field]) {
            return false;
        }
        return !(((_g = data[field]) === null || _g === void 0 ? void 0 : _g.length) <= Number(num));
    }
    if (condition.startsWith("max:")) {
        const [_, field, num] = condition.split(":");
        if (!((_h = schema.find((sc) => sc.name === field)) === null || _h === void 0 ? void 0 : _h.required) && !data[field]) {
            return false;
        }
        return ((_j = data[field]) === null || _j === void 0 ? void 0 : _j.length) <= Number(num);
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
export const validateRoles = (schema, roles, data) => {
    const errors = [];
    for (const role of roles) {
        // Separate AND and OR conditions
        const andConditions = role.condition.filter((cond) => !cond.startsWith("|"));
        const orConditions = role.condition.filter((cond) => cond.startsWith("|"));
        const andTrue = andConditions.length === 0 ||
            andConditions.every((cond) => checkCondition(schema, cond, data));
        const orTrue = orConditions.length > 0 &&
            orConditions.some((cond) => checkCondition(schema, cond, data));
        if ((andConditions.length > 0 && andTrue) || orTrue) {
            for (const field of role.fields) {
                if (!(errors === null || errors === void 0 ? void 0 : errors.find((err) => err.name === field.name))) {
                    errors.push({ name: field.name, error: field.error });
                }
            }
        }
    }
    const errorsJSON = {};
    errors === null || errors === void 0 ? void 0 : errors.map((err) => {
        errorsJSON[err.name] = err.error;
    });
    return errorsJSON;
};
