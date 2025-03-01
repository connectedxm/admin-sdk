import { ConnectedXMResponse } from "@src/interfaces";
import { PackageTranslation } from "@src/interfaces";
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
export const EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  packageId: string
) => [...EVENT_PACKAGE_QUERY_KEY(eventId, packageId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PACKAGE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPackageTranslations>>
) => {
  client.setQueryData(
    EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPackageTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  packageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPackageTranslations = async ({
  eventId,
  packageId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPackageTranslationsProps): Promise<
  ConnectedXMResponse<PackageTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/packages/${packageId}/translations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
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
export const useGetEventPackageTranslations = (
  eventId: string = "",
  packageId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPackageTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPackageTranslations>>
  >(
    EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY(eventId, packageId),
    (params: InfiniteQueryParams) =>
      GetEventPackageTranslations({
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
