import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITY_KPI_RESHARES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "KPI_RESHARES",
];

export const SET_ACTIVITY_KPI_RESHARES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_KPI_RESHARES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityKPIReshares>>
) => {
  client.setQueryData(ACTIVITY_KPI_RESHARES_QUERY_KEY(...keyParams), response);
};

interface GetActivityKPIResharesProps {
  activityId?: string;
}

interface DateCount {
  day: string;
  count: number;
}

export const GetActivityKPIReshares = async ({
  activityId,
}: GetActivityKPIResharesProps): Promise<ConnectedXMResponse<DateCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/kpi/reshares`);
  return data;
};

const useGetActivityKPIReshares = (activityId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivityKPIReshares>>((
    ACTIVITY_KPI_RESHARES_QUERY_KEY(activityId),
    () => GetActivityKPIReshares({ activityId }),
    {
      enabled: !!activityId,
    }
  );
};

export default useGetActivityKPIReshares;
