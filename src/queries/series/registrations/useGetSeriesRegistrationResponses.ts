import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  SeriesRegistrationQuestionResponse,
} from "@src/interfaces";
import { SERIES_REGISTRATION_QUERY_KEY } from "./useGetSeriesRegistration";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_REGISTRATION_RESPONSES_QUERY_KEY = (
  seriesId: string,
  registrationId: string
) => [...SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId), "RESPONSES"];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_REGISTRATION_RESPONSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_REGISTRATION_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesRegistrationResponses>>
) => {
  client.setQueryData(
    SERIES_REGISTRATION_RESPONSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSeriesRegistrationResponsesProps extends SingleQueryParams {
  seriesId: string;
  registrationId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesRegistrationResponses = async ({
  seriesId,
  registrationId,
  adminApiParams,
}: GetSeriesRegistrationResponsesProps): Promise<
  ConnectedXMResponse<SeriesRegistrationQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/registrations/${registrationId}/responses`
  );
  return data;
};

/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesRegistrationResponses = (
  seriesId: string = "",
  registrationId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSeriesRegistrationResponses>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSeriesRegistrationResponses>
  >(
    SERIES_REGISTRATION_RESPONSES_QUERY_KEY(seriesId, registrationId),
    (params: SingleQueryParams) =>
      GetSeriesRegistrationResponses({ seriesId, registrationId, ...params }),
    {
      ...options,
      enabled:
        !!seriesId &&
        !!registrationId &&
        (options?.enabled ?? true),
    }
  );
};
