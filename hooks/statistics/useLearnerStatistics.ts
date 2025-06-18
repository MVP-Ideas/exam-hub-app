import StatisticsService from "@/lib/services/statistics-service";
import { LearnerStatistics } from "@/lib/types/statistics";
import { useQuery } from "@tanstack/react-query";

const useLearnerStatistics = () => {
  const { data, isLoading, isFetching, isError } = useQuery<LearnerStatistics>({
    queryKey: ["learnerStatistics"],
    queryFn: async () => await StatisticsService.getLearnerStatistics(),
  });

  return {
    data,
    isLoading,
    isFetching,
    isError,
  };
};

export default useLearnerStatistics;
