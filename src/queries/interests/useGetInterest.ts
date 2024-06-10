import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Interest } from "@src/interfaces";
import { INTERESTS_QUERY_KEY } from "../interests/useGetInterests";
import { QueryClient } from "@tanstack/react-query";

export const INTEREST_QUERY_KEY = (interestId: string) => [
  ...INTERESTS_QUERY_KEY(),
  interestId,
];

export const SET_INTEREST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterest>>
) => {
  client.setQueryData(INTEREST_QUERY_KEY(...keyParams), response);
};

interface GetInterestProps {
  interestId: string;
}

export const GetInterest = async ({
  interestId,
}: GetInterestProps): Promise<ConnectedXMResponse<Interest>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}`);
  return data;
};

const useGetInterest = (interestId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInterest>>(
    INTEREST_QUERY_KEY(interestId),
    () => GetInterest({ interestId }),
    {
      enabled: !!interestId,
    }
  );
};

export default useGetInterest;
