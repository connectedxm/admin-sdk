import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Export } from "@interfaces";
import { EVENT_REGISTRATION_EXPORTS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrationExports";

interface CreateEventRegistrationExportParams {
  eventId: string;
}

export const CreateEventRegistrationExport = async ({
  eventId,
}: CreateEventRegistrationExportParams): Promise<
  ConnectedXMResponse<Export>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/registrations/exports`
  );
  return data;
};

export const useCreateEventRegistrationExport = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    () => CreateEventRegistrationExport({ eventId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_EXPORTS_QUERY_KEY(eventId, undefined)
        );
      },
    }
  );
};

export default useCreateEventRegistrationExport;
