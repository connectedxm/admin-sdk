import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, EventSessionLocation } from "@src/interfaces";
import { EVENT_SESSION_LOCATIONS_QUERY_KEY } from "./useGetEventSessionLocations";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_LOCATION_QUERY_KEY = (
  eventId: string,
  locationId: string
) => [...EVENT_SESSION_LOCATIONS_QUERY_KEY(eventId), locationId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_LOCATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_LOCATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionLocation>>
) => {
  client.setQueryData(EVENT_SESSION_LOCATION_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionLocationProps extends SingleQueryParams {
  eventId: string;
  locationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionLocation = async ({
  eventId,
  locationId,
  adminApiParams,
}: GetEventSessionLocationProps): Promise<
  ConnectedXMResponse<EventSessionLocation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionLocations/${locationId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionLocation = (
  eventId: string = "",
  locationId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionLocation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionLocation>>(
    EVENT_SESSION_LOCATION_QUERY_KEY(eventId, locationId),
    (params) => GetEventSessionLocation({ eventId, locationId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!locationId,
    },
    "events"
  );
};
