import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { OrgMembership } from "@src/interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryClient } from "@tanstack/react-query";

export const SELF_MEMBERSHIP_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "MEMBERSHIP",
];

export const SET_SELF_MEMBERSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_MEMBERSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfOrgMembership>>
) => {
  client.setQueryData(SELF_MEMBERSHIP_QUERY_KEY(...keyParams), response);
};

interface GetSelfOrgMembershipProps {}

export const GetSelfOrgMembership = async ({}: GetSelfOrgMembershipProps) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/organization-membership`);
  return data;
};

const useGetSelfOrgMembership = () => {
  return useConnectedSingleQuery<ConnectedXMResponse<OrgMembership>>(
    SELF_MEMBERSHIP_QUERY_KEY(),
    () => GetSelfOrgMembership({}),
    {}
  );
};

export default useGetSelfOrgMembership;
