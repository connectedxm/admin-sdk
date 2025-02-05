import { ConnectedXMResponse } from "@src/interfaces";
import { EventOnSiteBadgeField } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY } from "./useGetEventZplTemplateBadgeFields";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches a specific ZPL template badge field associated with an event from the admin API.
 * This function is used to retrieve detailed information about a particular badge field within a ZPL template for a given event.
 * It is designed for applications that require access to specific badge field data for event management purposes.
 * @name GetEventZplTemplateBadgeField
 * @param {string} fieldId - The id of the badge field
 * @param {string} eventId - The id of the event
 * @version 1.2
 **/

export const EVENT_ZPL_TEMPLATE_BADGE_FIELD_QUERY_KEY = (
  eventId: string,
  fieldId: string
) => [...EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY(eventId), fieldId];

export const SET_EVENT_ZPL_TEMPLATE_BADGE_FIELD_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventZplTemplateBadgeField>>
) => {
  client.setQueryData(
    EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventZplTemplateBadgeFieldProps extends SingleQueryParams {
  fieldId: string;
  eventId: string;
}

export const GetEventZplTemplateBadgeField = async ({
  fieldId,
  eventId,
  adminApiParams,
}: GetEventZplTemplateBadgeFieldProps): Promise<
  ConnectedXMResponse<EventOnSiteBadgeField>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/zpl-template/fields/${fieldId}`
  );
  return data;
};

export const useGetEventZplTemplateBadgeField = (
  eventId: string = "",
  fieldId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventZplTemplateBadgeField>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventZplTemplateBadgeField>
  >(
    EVENT_ZPL_TEMPLATE_BADGE_FIELD_QUERY_KEY(eventId, fieldId),
    (params: SingleQueryParams) =>
      GetEventZplTemplateBadgeField({ ...params, eventId, fieldId }),
    {
      ...options,
      enabled: !!eventId && !!fieldId,
    },
    "events"
  );
};