import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventOnSiteBadgeField } from "@interfaces";
import { EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY } from "@context/queries/events/on-site/useGetEventZplTemplateBadgeFields";

interface UpdateEventZplTemplateBadgeFieldParams {
  eventId: string;
  fieldId: string;
  field: EventOnSiteBadgeField;
}

export const UpdateEventZplTemplateBadgeField = async ({
  eventId,
  fieldId,
  field,
}: UpdateEventZplTemplateBadgeFieldParams): Promise<
  ConnectedXMResponse<EventOnSiteBadgeField>
> => {
  if (!fieldId) throw new Error("Field ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/zpl-template/fields/${fieldId}`,
    {
      ...field,
      id: undefined,
      eventId: undefined,
      name: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      onSite: undefined,
    }
  );
  return data;
};

export const useUpdateEventZplTemplateBadgeField = (
  eventId: string,
  fieldId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (field: EventOnSiteBadgeField) =>
      UpdateEventZplTemplateBadgeField({
        eventId,
        fieldId: fieldId || field?.id?.toString(),
        field,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventZplTemplateBadgeField>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY(eventId)
        );
        // SET_EVENT_ZPL_TEMPLATE_BADGE_FIELD_QUERY_DATA(
        //   queryClient,
        //   [eventId],
        //   response
        // );
      },
    }
  );
};

export default useUpdateEventZplTemplateBadgeField;
