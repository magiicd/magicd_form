export const toUpper = (name) => {
    if (typeof name !== "string")
        return "";
    return `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`;
};
// all of the words starts with uppercase
export const toAllUpper = (name) => {
    return name && typeof name === "string"
        ? name
            .split(" ")
            .map((r) => toUpper(r))
            .join(" ")
        : name;
};
