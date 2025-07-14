// Responses
export type ResourceResponse = {
  id: string;
  title: string;
  description: string;
  value: string;
  type: "File" | "Url";
};

// Requests
export type CreateUrlResourceRequest = {
  title: string;
  description: string;
  url: string;
};

export type CreateFileResourceRequest = {
  title: string;
  description: string;
  file: File;
};
