import { GetAdminAPI } from "@src/AdminAPI";
import { EventPass, ConnectedXMResponse } from "@src/interfaces";
import {
  CursorQueryOptions,
  CursorQueryParams,
  useConnectedCursorQuery,
} from "../../useConnectedCursorQuery";
import { SERIES_REGISTRATION_QUERY_KEY } from "./useGetSeriesRegistration";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_REGISTRATION_PASSES_QUERY_KEY = (
  seriesId: string,
  registrationId: string
) => [...SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId), "PASSES"];

interface GetSeriesRegistrationPassesProps extends CursorQueryParams {
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
  cursor,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesRegistrationPassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/registrations/${registrationId}/passes`,
    {
      params: {
        cursor: cursor || undefined,
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
    CursorQueryParams,
    "cursor" | "queryClient" | "adminApiParams"
  > = {},
  options: CursorQueryOptions<
    Awaited<ReturnType<typeof GetSeriesRegistrationPasses>>
  > = {}
) => {
  return useConnectedCursorQuery<
    Awaited<ReturnType<typeof GetSeriesRegistrationPasses>>
  >(
    SERIES_REGISTRATION_PASSES_QUERY_KEY(seriesId, registrationId),
    (params: CursorQueryParams) =>
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
