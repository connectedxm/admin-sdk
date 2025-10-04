import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPackage } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PACKAGES_QUERY_KEY } from "./useGetEventPackages";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PACKAGE_QUERY_KEY = (eventId: string, packageId: string) => [
  ...EVENT_PACKAGES_QUERY_KEY(eventId),
  packageId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PACKAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PACKAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPackage>>
) => {
  client.setQueryData(EVENT_PACKAGE_QUERY_KEY(...keyParams), response);
};

interface GetEventPackageProps extends SingleQueryParams {
  eventId: string;
  packageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPackage = async ({
  eventId,
  packageId,
  adminApiParams,
}: GetEventPackageProps): Promise<ConnectedXMResponse<EventPackage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/packages/${packageId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPackage = (
  eventId: string = "",
  packageId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPackage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPackage>>(
    EVENT_PACKAGE_QUERY_KEY(eventId, packageId),
    (params: SingleQueryParams) =>
      GetEventPackage({ eventId, packageId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!packageId && (options?.enabled ?? true),
    }
  );
};
