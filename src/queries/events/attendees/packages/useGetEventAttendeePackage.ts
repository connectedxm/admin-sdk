import { ConnectedXMResponse, AttendeePackage } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_ATTENDEE_PACKAGES_QUERY_KEY } from "./useGetEventAttendeePackages";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_PACKAGE_QUERY_KEY = (
  eventId: string,
  accountId: string,
  packageId: string
) => [...EVENT_ATTENDEE_PACKAGES_QUERY_KEY(eventId, accountId), packageId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_PACKAGE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PACKAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePackage>>
) => {
  client.setQueryData(EVENT_ATTENDEE_PACKAGE_QUERY_KEY(...keyParams), response);
};

interface GetEventAttendeePackageProps extends SingleQueryParams {
  eventId: string;
  accountId: string;
  packageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeePackage = async ({
  eventId,
  accountId,
  packageId,
  adminApiParams,
}: GetEventAttendeePackageProps): Promise<
  ConnectedXMResponse<AttendeePackage>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}/packages/${packageId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAttendeePackage = (
  eventId: string,
  accountId: string,
  packageId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventAttendeePackage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAttendeePackage>>(
    EVENT_ATTENDEE_PACKAGE_QUERY_KEY(eventId, accountId, packageId),
    (params: SingleQueryParams) =>
      GetEventAttendeePackage({
        eventId,
        accountId,
        packageId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!accountId && !!packageId && (options?.enabled ?? true),
    }
  );
};
