import api from "../axios";
import { LearnerStatisticsResponse } from "../types/statistics";

const BASE_URL = "statistics";

const StatisticsService = {
  getLearnerStatistics: async () => {
    const response = await api.get<LearnerStatisticsResponse>(
      `${BASE_URL}/learners`,
    );
    return response.data;
  },
};

export default StatisticsService;
