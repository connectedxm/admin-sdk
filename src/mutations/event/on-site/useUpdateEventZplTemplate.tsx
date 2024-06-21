import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventOnSite } from "@interfaces";
import { SET_EVENT_ON_SITE_QUERY_DATA } from "@context/queries/events/on-site/useGetEventOnSite";

interface UpdateEventZplTemplateParams {
  eventId: string;
  zplTemplate: string;
}

export const UpdateEventZplTemplate = async ({
  eventId,
  zplTemplate,
}: UpdateEventZplTemplateParams): Promise<ConnectedXMResponse<EventOnSite>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/events/${eventId}/zpl-template`, {
    zplTemplate,
  });
  return data;
};

export const useUpdateEventZplTemplate = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (zplTemplate: string) => UpdateEventZplTemplate({ zplTemplate, eventId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventZplTemplate>>
      ) => {
        SET_EVENT_ON_SITE_QUERY_DATA(queryClient, [eventId], response);
      },
    }
  );
};

export default useUpdateEventZplTemplate;
