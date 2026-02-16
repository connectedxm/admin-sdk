import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAttendee } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SERIES_REGISTRATION_QUERY_KEY } from "./useGetSeriesRegistration";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_REGISTRATION_PASSES_QUERY_KEY = (
  seriesId: string,
  registrationId: string
) => [...SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId), "PASSES"];

interface GetSeriesRegistrationPassesProps extends InfiniteQueryParams {
  seriesId: string;
  registrationId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesRegistrationPasses = async ({
  seriesId,
  registrationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesRegistrationPassesProps): Promise<
  ConnectedXMResponse<EventAttendee[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/registrations/${registrationId}/passes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesRegistrationPasses = (
  seriesId: string = "",
  registrationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesRegistrationPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesRegistrationPasses>>
  >(
    SERIES_REGISTRATION_PASSES_QUERY_KEY(seriesId, registrationId),
    (params: InfiniteQueryParams) =>
      GetSeriesRegistrationPasses({
        ...params,
        seriesId,
        registrationId,
      }),
    params,
    {
      ...options,
      enabled: !!seriesId && !!registrationId && (options?.enabled ?? true),
    }
  );
};
