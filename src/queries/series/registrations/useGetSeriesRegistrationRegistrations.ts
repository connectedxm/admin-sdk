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
export const SERIES_REGISTRATION_REGISTRATIONS_QUERY_KEY = (
  seriesId: string,
  registrationId: string
) => [
  ...SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId),
  "REGISTRATIONS",
];

interface GetSeriesRegistrationRegistrationsProps extends InfiniteQueryParams {
  seriesId: string;
  registrationId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesRegistrationRegistrations = async ({
  seriesId,
  registrationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesRegistrationRegistrationsProps): Promise<
  ConnectedXMResponse<EventAttendee[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/registrations/${registrationId}/registrations`,
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
export const useGetSeriesRegistrationRegistrations = (
  seriesId: string = "",
  registrationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesRegistrationRegistrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesRegistrationRegistrations>>
  >(
    SERIES_REGISTRATION_REGISTRATIONS_QUERY_KEY(seriesId, registrationId),
    (params: InfiniteQueryParams) =>
      GetSeriesRegistrationRegistrations({
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
