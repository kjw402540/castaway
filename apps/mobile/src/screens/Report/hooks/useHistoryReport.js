import { getHistoryReports } from "../ReportHistoryService";

export function useHistoryReport() {
  return getHistoryReports();
}
