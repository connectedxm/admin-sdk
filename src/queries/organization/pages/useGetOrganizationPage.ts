import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Page } from "@src/interfaces";
import { PageType } from "@/context/mutations/organization/pages/useUpdateOrganizationPage";
import { ORGANIZATION_QUERY_KEY } from "../useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_PAGE_QUERY_KEY = (type: PageType) => ["PAGE", type];

export const SET_ORGANIZATION_PAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPage>>
) => {
  client.setQueryData(ORGANIZATION_PAGE_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationPageProps {
  type: PageType;
}

export const GetOrganizationPage = async ({
  type,
}: GetOrganizationPageProps): Promise<ConnectedXMResponse<Page>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/pages/${type}`);
  return data;
};

const useGetOrganizationPage = (type: PageType) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationPage>>((ORGANIZATION_PAGE_QUERY_KEY(type), () => GetOrganizationPage({ type }), {
    enabled: !!type,
  });
};

export default useGetOrganizationPage;
