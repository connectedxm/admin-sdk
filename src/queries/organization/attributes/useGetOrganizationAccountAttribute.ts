import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { AccountAttribute } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY } from "./useGetOrganizationAccountAttributes";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_KEY = (
  attributeId: string
) => [...ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY(), attributeId];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationAccountAttribute>>
) => {
  client.setQueryData(
    ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationAccountAttributeProps extends SingleQueryParams {
  attributeId: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationAccountAttribute = async ({
  attributeId,
  adminApiParams,
}: GetOrganizationAccountAttributeProps): Promise<
  ConnectedXMResponse<AccountAttribute>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/attributes/${attributeId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationAccountAttribute = (
  attributeId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationAccountAttribute>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationAccountAttribute>
  >(
    ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_KEY(attributeId),
    (params: SingleQueryParams) =>
      GetOrganizationAccountAttribute({ ...params, attributeId }),
    {
      ...options,
      enabled: !!attributeId && (options.enabled ?? true),
    }
  );
};
