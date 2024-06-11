import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { LEVELS_QUERY_KEY } from "./useGetLevels";
import { QueryClient } from "@tanstack/react-query";

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
}: GetLevelProps) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels/${sponsorshipLevelId}`);
  return data;
};

const useGetLevel = (
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
    }
  );
};

export default useGetLevel;
