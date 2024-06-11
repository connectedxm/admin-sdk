import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_TIERS_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_TIERS",
];

interface GetEventKPITiersProps extends SingleQueryParams {
  eventId?: string;
}

interface DateSumCount {
  label: string;
  value: number;
}

export const GetEventKPITiers = async ({
  eventId,
  adminApiParams,
}: GetEventKPITiersProps): Promise<ConnectedXMResponse<DateSumCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/tiers`);
  return data;
};

const useGetEventKPITiers = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventKPITiers>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPITiers>>(
    EVENT_QUERY_KPI_TIERS_KEY(eventId),
    (params: SingleQueryParams) => GetEventKPITiers({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventKPITiers;
