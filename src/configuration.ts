function checkAndReturn(value: string | undefined): string {
    if (value === undefined) throw new Error("value should be defined");
    return value;
}


export const NEO4J_HOSTNAME = checkAndReturn(process.env.REACT_APP_NEO4J_HOSTNAME);
export const NEO4J_USERNAME = checkAndReturn(process.env.REACT_APP_NEO4J_USERNAME);
export const NEO4J_PASSWORD = checkAndReturn(process.env.REACT_APP_NEO4J_PASSWORD);
