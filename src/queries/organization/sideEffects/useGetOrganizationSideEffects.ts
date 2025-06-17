import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SideEffect,
  SideEffectTriggerType,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { ORGANIZATION_QUERY_KEY } from "../useGetOrganization";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_SIDE_EFFECTS_QUERY_KEY = (
  triggerType?: keyof typeof SideEffectTriggerType,
  triggerId?: string
) => {
  const keys = [...ORGANIZATION_QUERY_KEY(), "SIDE_EFFECTS"];

  if (triggerType) {
    keys.push(triggerType);
  }

  if (triggerId) {
    keys.push(triggerId);
  }

  return keys;
};

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_SIDE_EFFECTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ORGANIZATION_SIDE_EFFECTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationSideEffects>>
) => {
  client.setQueryData(
    ORGANIZATION_SIDE_EFFECTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationSideEffectsProps extends InfiniteQueryParams {
  triggerType?: keyof typeof SideEffectTriggerType;
  triggerId?: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationSideEffects = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  triggerType,
  triggerId,
  adminApiParams,
}: GetOrganizationSideEffectsProps): Promise<
  ConnectedXMResponse<SideEffect[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/sideEffects`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      triggerType: triggerType || undefined,
      triggerId: triggerId || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationSideEffects = (
  params: Omit<
    GetOrganizationSideEffectsProps,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationSideEffects>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationSideEffects>>
  >(
    ORGANIZATION_SIDE_EFFECTS_QUERY_KEY(params.triggerType, params.triggerId),
    (queryParams: InfiniteQueryParams) =>
      GetOrganizationSideEffects({
        ...queryParams,
        ...params,
      }),
    params,
    {
      ...options,
    },
    "org"
  );
};
