export type Resource = {
  id: string;
  title: string;
  description: string;
  value: string;
  type: "File" | "Url";
};

export type ResourceUrlCreate = {
  title: string;
  description: string;
  url: string;
};

export type ResourceFileCreate = {
  title: string;
  description: string;
  file: File;
};
