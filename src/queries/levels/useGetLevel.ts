import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { LEVELS_QUERY_KEY } from "./useGetLevels";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse, Level } from "@src/interfaces";

/**
 * Fetches details for a specific sponsorship level by its ID.
 * This function is used to retrieve detailed information about a particular sponsorship level within the system.
 * It is designed to be utilized in applications where such detailed level information is necessary.
 * @name GetLevel
 * @param {string} sponsorshipLevelId - The ID of the sponsorship level
 * @version 1.2
 **/

export const LEVEL_QUERY_KEY = (levelId: string) => [
  ...LEVELS_QUERY_KEY(),
  levelId,
];

export const SET_LEVEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVEL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevel>>
) => {
  client.setQueryData(LEVEL_QUERY_KEY(...keyParams), response);
};

interface GetLevelProps extends SingleQueryParams {
  sponsorshipLevelId: string;
}

export const GetLevel = async ({
  sponsorshipLevelId,
  adminApiParams,
}: GetLevelProps): Promise<ConnectedXMResponse<Level>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<Level>>(
    `/levels/${sponsorshipLevelId}`
  );
  return data;
};

export const useGetLevel = (
  sponsorshipLevelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLevel>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLevel>>(
    LEVEL_QUERY_KEY(sponsorshipLevelId),
    (params: SingleQueryParams) =>
      GetLevel({
        sponsorshipLevelId,
        ...params,
      }),
    {
      ...options,
      enabled: !!sponsorshipLevelId && (options.enabled ?? true),
    },
    "sponsors"
  );
};