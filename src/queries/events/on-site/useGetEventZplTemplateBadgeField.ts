import { ConnectedXMResponse } from "@src/interfaces";
import { EventOnSiteBadgeField } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY } from "./useGetEventZplTemplateBadgeFields";
import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";

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

interface GetEventZplTemplateBadgeFieldProps {
  fieldId: string;
  eventId: string;
}

export const GetEventZplTemplateBadgeField = async ({
  fieldId,
  eventId,
}: GetEventZplTemplateBadgeFieldProps): Promise<
  ConnectedXMResponse<EventOnSiteBadgeField>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/zpl-template/fields/${fieldId}`
  );
  return data;
};

const useGetEventZplTemplateBadgeField = (eventId: string, fieldId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventZplTemplateBadgeField>>((
    EVENT_ZPL_TEMPLATE_BADGE_FIELD_QUERY_KEY(eventId, fieldId),
    (params: any) =>
      GetEventZplTemplateBadgeField({ ...params, eventId, fieldId }),
    {
      enabled: !!eventId && !!fieldId,
    }
  );
};

export default useGetEventZplTemplateBadgeField;
