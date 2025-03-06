import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StandardReport } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Reports
 */
export const REPORT_QUERY_KEY = (standard: string) => ["REPORT", standard];

/**
 * @category Setters
 * @group Reports
 */
export const SET_REPORT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REPORT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReport>>
) => {
  client.setQueryData(REPORT_QUERY_KEY(...keyParams), response);
};

interface GetReportProps extends SingleQueryParams {
  standard: string;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetReport = async ({
  standard,
  adminApiParams,
}: GetReportProps): Promise<ConnectedXMResponse<StandardReport>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  let nextCursor: number | null = null;
  const rowData: object[] = [];

  const { data } = await adminApi.get<ConnectedXMResponse<StandardReport>>(
    `/reports/${standard}`
  );

  rowData.push(...data.data.rowData);
  nextCursor = data.data.nextCursor;

  while (nextCursor) {
    const { data: nextData } = await adminApi.get<
      ConnectedXMResponse<StandardReport>
    >(`/reports/${standard}`, {
      params: {
        cursor: nextCursor,
      },
    });

    rowData.push(...nextData.data.rowData);
    nextCursor = nextData.data.nextCursor;
  }

  return {
    ...data,
    data: {
      ...data.data,
      rowData,
    },
  };
};
/**
 * @category Hooks
 * @group Reports
 */
export const useGetReport = (
  standard: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetReport>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReport>>(
    REPORT_QUERY_KEY(standard),
    (params: SingleQueryParams) => GetReport({ standard, ...params }),
    {
      ...options,
      enabled: !!standard && (options?.enabled ?? true),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
    },
    "reports"
  );
};
