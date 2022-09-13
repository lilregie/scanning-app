export const basePath = import.meta.env.VITE_BASE_PATH ? import.meta.env.VITE_BASE_PATH : "";
console.log("Running on basePath", basePath);


// Used if a request is taking to long,
// it controls the trigger of the error message
export const apiWarnLongTimeMS = 10000;

export const gitCommitHash = __COMMIT_HASH__ || "unknown";