export const getStatusColor = (status: string) => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-800";
    case "Draft":
      return "bg-yellow-100 text-yellow-800";
    case "Archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-primary text-white";
    case "Intermediate":
      return "bg-orange-200 text-orange-800";
    case "Advanced":
      return "bg-red-300 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};
