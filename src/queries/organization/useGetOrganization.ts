import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Organization } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_QUERY_KEY = () => ["ORGANIZATION"];

export const SET_ORGANIZATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganization>>
) => {
  client.setQueryData(ORGANIZATION_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationProps {}

export const GetOrganization = async ({}: GetOrganizationProps): Promise<
  ConnectedXMResponse<Organization>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization`);
  return data;
};

const useGetOrganization = () => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganization>>(
    ORGANIZATION_QUERY_KEY(),
    () => GetOrganization({}),
    {}
  );
};

export default useGetOrganization;
