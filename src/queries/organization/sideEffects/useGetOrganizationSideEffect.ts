import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SideEffect } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ORGANIZATION_SIDE_EFFECTS_QUERY_KEY } from "./useGetOrganizationSideEffects";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_SIDE_EFFECT_QUERY_KEY = (sideEffectId: string) => [
  ...ORGANIZATION_SIDE_EFFECTS_QUERY_KEY(),
  sideEffectId,
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_SIDE_EFFECT_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ORGANIZATION_SIDE_EFFECT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationSideEffect>>
) => {
  client.setQueryData(
    ORGANIZATION_SIDE_EFFECT_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationSideEffectProps extends SingleQueryParams {
  sideEffectId: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationSideEffect = async ({
  sideEffectId,
  adminApiParams,
}: GetOrganizationSideEffectProps): Promise<
  ConnectedXMResponse<SideEffect>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/sideEffects/${sideEffectId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationSideEffect = (
  sideEffectId: string,
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationSideEffect>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationSideEffect>>(
    ORGANIZATION_SIDE_EFFECT_QUERY_KEY(sideEffectId),
    (params: SingleQueryParams) =>
      GetOrganizationSideEffect({ sideEffectId, ...params }),
    {
      ...options,
      enabled: !!sideEffectId && (options?.enabled ?? true),
    }
  );
};
