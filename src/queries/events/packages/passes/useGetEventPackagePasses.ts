import { ConnectedXMResponse } from "@src/interfaces";
import { PackagePass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_PACKAGE_QUERY_KEY } from "../useGetEventPackage";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PACKAGE_PASSES_QUERY_KEY = (
  eventId: string,
  packageId: string
) => [...EVENT_PACKAGE_QUERY_KEY(eventId, packageId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PACKAGE_PASSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PACKAGE_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPackagePasses>>
) => {
  client.setQueryData(EVENT_PACKAGE_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventPackagePassesProps extends InfiniteQueryParams {
  eventId: string;
  packageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPackagePasses = async ({
  eventId,
  packageId,
  pageParam,
  pageSize,
  search,
  adminApiParams,
}: GetEventPackagePassesProps): Promise<ConnectedXMResponse<PackagePass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/packages/${packageId}/passes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPackagePasses = (
  eventId: string = "",
  packageId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPackagePasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPackagePasses>>
  >(
    EVENT_PACKAGE_PASSES_QUERY_KEY(eventId, packageId),
    (params: InfiniteQueryParams) =>
      GetEventPackagePasses({
        ...params,
        eventId,
        packageId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!packageId && (options.enabled ?? true),
    },
    "events"
  );
};
