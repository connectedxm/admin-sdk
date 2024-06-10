import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipLevel } from "@src/interfaces";
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

interface GetLevelProps {
  sponsorshipLevelId: string;
}

export const GetLevel = async ({ sponsorshipLevelId }: GetLevelProps) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels/${sponsorshipLevelId}`);
  return data;
};

const useGetLevel = (sponsorshipLevelId: string) => {
  return useConnectedSingleQuery<ConnectedXMResponse<SponsorshipLevel>>(
    LEVEL_QUERY_KEY(sponsorshipLevelId),
    () =>
      GetLevel({
        sponsorshipLevelId,
      }),
    {
      enabled: !!sponsorshipLevelId,
    }
  );
};

export default useGetLevel;
