import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Export } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface CreateEventRegistrationExportParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const CreateEventRegistrationExport = async ({
  eventId,
  adminApiParams,
  queryClient,
}: CreateEventRegistrationExportParams): Promise<
  ConnectedXMResponse<Export>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/events/${eventId}/registrations/exports`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_EXPORTS_QUERY_KEY(eventId, undefined),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useCreateEventRegistrationExport = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventRegistrationExport>>,
      Omit<
        CreateEventRegistrationExportParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRegistrationExportParams,
    Awaited<ReturnType<typeof CreateEventRegistrationExport>>
  >(CreateEventRegistrationExport, options);
};
