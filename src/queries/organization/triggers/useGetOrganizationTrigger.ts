import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { OrganizationTrigger } from "@src/interfaces";
import { TriggerType } from "@/context/mutations/organization/triggers/useUpdateOrganizationTrigger";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_TRIGGER_QUERY_KEY = (type: TriggerType) => [
  "TRIGGER",
  type,
];

export const SET_ORGANIZATION_TRIGGER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_TRIGGER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationTrigger>>
) => {
  client.setQueryData(ORGANIZATION_TRIGGER_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationTriggerProps {
  type: TriggerType;
}

export const GetOrganizationTrigger = async ({
  type,
}: GetOrganizationTriggerProps): Promise<
  ConnectedXMResponse<OrganizationTrigger>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/triggers/${type}`);
  return data;
};

const useGetOrganizationTrigger = (type: TriggerType) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationTrigger>>((
    ORGANIZATION_TRIGGER_QUERY_KEY(type),
    () => GetOrganizationTrigger({ type }),
    {
      enabled: !!type,
    }
  );
};

export default useGetOrganizationTrigger;
