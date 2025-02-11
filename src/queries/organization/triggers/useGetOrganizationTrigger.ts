import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, OrganizationTriggerType } from "@src/interfaces";
import { OrganizationTrigger } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches an organization trigger based on the specified type.
 * This function is designed to retrieve details of a specific organization trigger, 
 * which can be used in applications that require information about organizational triggers.
 * @name GetOrganizationTrigger
 * @param {OrganizationTriggerType} type (path) The type of the organization trigger
 * @version 1.3
 **/

export const ORGANIZATION_TRIGGER_QUERY_KEY = (
  type: OrganizationTriggerType
) => ["TRIGGER", type];

export const SET_ORGANIZATION_TRIGGER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_TRIGGER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationTrigger>>
) => {
  client.setQueryData(ORGANIZATION_TRIGGER_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationTriggerProps extends SingleQueryParams {
  type: OrganizationTriggerType;
}

export const GetOrganizationTrigger = async ({
  type,
  adminApiParams,
}: GetOrganizationTriggerProps): Promise<
  ConnectedXMResponse<OrganizationTrigger>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/triggers/${type}`);
  return data;
};

export const useGetOrganizationTrigger = (
  type: OrganizationTriggerType,
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationTrigger>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationTrigger>>(
    ORGANIZATION_TRIGGER_QUERY_KEY(type),
    (params: SingleQueryParams) => GetOrganizationTrigger({ type, ...params }),
    {
      ...options,
      enabled: !!type && (options?.enabled ?? true),
    },
    "org"
  );
};