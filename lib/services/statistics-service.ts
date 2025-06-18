import api from "../axios";
import { LearnerStatistics } from "../types/statistics";

const BASE_URL = "statistics";

const StatisticsService = {
  getLearnerStatistics: async () => {
    const response = await api.get<LearnerStatistics>(`${BASE_URL}/learners`);
    return response.data;
  },
};

export default StatisticsService;
