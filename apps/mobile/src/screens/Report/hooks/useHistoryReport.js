import { getHistoryReports } from "../../../services/reportHistoryService";

export function useHistoryReport() {
  return getHistoryReports();
}
