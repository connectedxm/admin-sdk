import { ConnectedXMResponse } from "../../interfaces";
import { GetBaseUri } from "../../utilities";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";

export const ANALYTICS_QUERY_KEY = (
  startDate: string,
  endDate: string,
  eventName?: string
) => {
  const keys = ["ANALYTICS", startDate, endDate];
  if (eventName) keys.push(eventName);
  return keys;
};

export const SET_ANALYTICS_QUERY_DATA = (
  client: any,
  keyPath: string[],
  response: ConnectedXMResponse<any>
) => {
  client.setQueryData(keyPath, response);
};

export interface GetAnalyticsParams {
  startDate: string;
  endDate: string;
  eventName?: string;
}

export const GetAnalytics = async ({
  startDate,
  endDate,
  eventName,
}: GetAnalyticsParams): Promise<ConnectedXMResponse<any>> => {
  const { data } = await GetBaseUri(true).post(`/query`, {
    startDate,
    endDate,
    eventName,
  });
  return data;
};

export const useGetAnalytics = (
  params: GetAnalyticsParams,
  options: any = {}
) => {
  return useConnectedSingleQuery<ConnectedXMResponse<any>>(
    ANALYTICS_QUERY_KEY(params.startDate, params.endDate, params.eventName),
    () => GetAnalytics(params),
    {
      ...options,
      enabled: !!params.startDate && !!params.endDate && (options?.enabled ?? true),
    }
  );
};
