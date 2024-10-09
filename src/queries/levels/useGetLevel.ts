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
 * @category Keys
 * @group Levels
 */
export const LEVEL_QUERY_KEY = (levelId: string) => [
  ...LEVELS_QUERY_KEY(),
  levelId,
];

/**
 * @category Setters
 * @group Levels
 */
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

/**
 * @category Queries
 * @group Levels
 */
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
/**
 * @category Hooks
 * @group Levels
 */
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
    "levels"
  );
};
