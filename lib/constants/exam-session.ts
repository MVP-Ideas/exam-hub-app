export const SESSION_STATUS_OPTIONS = [
  { value: "InProgress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "ToBeReviewed", label: "To Be Reviewed" },
];

export enum SessionStatus {
  InProgress = "InProgress",
  Completed = "Completed",
  ToBeReviewed = "ToBeReviewed",
}
