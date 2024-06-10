import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Report, ReportType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const REPORTS_QUERY_KEY = (
  type: keyof typeof ReportType,
  eventId?: string
) => {
  const keys = ["REPORTS", type];
  if (eventId) keys.push(eventId);
  return keys;
};

export const SET_REPORTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REPORTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReports>>
) => {
  client.setQueryData(REPORTS_QUERY_KEY(...keyParams), response);
};

interface GetReportsProps extends InfiniteQueryParams {
  type: keyof typeof ReportType;
  eventId?: string;
}

export const GetReports = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
  eventId,
}: GetReportsProps): Promise<ConnectedXMResponse<Report[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type,
      eventId,
    },
  });
  return data;
};

const useGetReports = (type: keyof typeof ReportType, eventId?: string) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetReports>>>(
    REPORTS_QUERY_KEY(type, eventId),
    (params: any) => GetReports({ ...params, type, eventId }),
    {
      enabled: type === "event" ? !!eventId : true,
    },
    {}
  );
};

export default useGetReports;
