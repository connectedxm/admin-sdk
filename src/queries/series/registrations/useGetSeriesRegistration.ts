import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";

import { ConnectedXMResponse, SeriesRegistration } from "@src/interfaces";
import { SERIES_REGISTRATIONS_QUERY_KEY } from "./useGetSeriesRegistrations";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_REGISTRATION_QUERY_KEY = (
  seriesId: string,
  registrationId: string
) => [...SERIES_REGISTRATIONS_QUERY_KEY(seriesId), registrationId];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesRegistration>>
) => {
  client.setQueryData(SERIES_REGISTRATION_QUERY_KEY(...keyParams), response);
};

interface GetSeriesRegistrationProps extends SingleQueryParams {
  seriesId: string;
  registrationId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesRegistration = async ({
  seriesId,
  registrationId,
  adminApiParams,
}: GetSeriesRegistrationProps): Promise<
  ConnectedXMResponse<SeriesRegistration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/registrations/${registrationId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesRegistration = (
  seriesId: string = "",
  registrationId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSeriesRegistration>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSeriesRegistration>>(
    SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId),
    (params) => GetSeriesRegistration({ seriesId, registrationId, ...params }),
    {
      ...options,
      enabled: !!seriesId && !!registrationId && (options?.enabled ?? true),
    }
  );
};
