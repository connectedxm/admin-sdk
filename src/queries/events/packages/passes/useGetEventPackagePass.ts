import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPackagePass } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PACKAGE_PASSES_QUERY_KEY } from "./useGetEventPackagePasses";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PACKAGE_PASS_QUERY_KEY = (
  eventId: string,
  packageId: string,
  passId: string
) => [...EVENT_PACKAGE_PASSES_QUERY_KEY(eventId, packageId), passId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PACKAGE_PASS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PACKAGE_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPackagePass>>
) => {
  client.setQueryData(EVENT_PACKAGE_PASS_QUERY_KEY(...keyParams), response);
};

interface GetEventPackagePassProps extends SingleQueryParams {
  eventId: string;
  packageId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPackagePass = async ({
  eventId,
  packageId,
  passId,
  adminApiParams,
}: GetEventPackagePassProps): Promise<
  ConnectedXMResponse<EventPackagePass>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/packages/${packageId}/passes/${passId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPackagePass = (
  eventId: string = "",
  packageId: string = "",
  passId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPackagePass>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPackagePass>>(
    EVENT_PACKAGE_PASS_QUERY_KEY(eventId, packageId, passId),
    (params: SingleQueryParams) =>
      GetEventPackagePass({ eventId, packageId, passId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!packageId && !!passId && (options?.enabled ?? true),
    }
  );
};
