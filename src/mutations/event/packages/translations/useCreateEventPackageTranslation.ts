import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPackageTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/packages/translations/useGetEventPackageTranslations";
import { SET_EVENT_PACKAGE_TRANSLATION_QUERY_DATA } from "@src/queries/events/packages/translations/useGetEventPackageTranslation";

/**
 * @category Params
 * @group Event-Packages
 */
export interface CreateEventPackageTranslationParams extends MutationParams {
  eventId: string;
  packageId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const CreateEventPackageTranslation = async ({
  eventId,
  packageId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventPackageTranslationParams): Promise<
  ConnectedXMResponse<EventPackageTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventPackageTranslation>
  >(`/events/${eventId}/packages/${packageId}/translations`, {
    locale,
    autoTranslate,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY(eventId, packageId),
    });
    SET_EVENT_PACKAGE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, packageId, locale || data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useCreateEventPackageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPackageTranslation>>,
      Omit<
        CreateEventPackageTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPackageTranslationParams,
    Awaited<ReturnType<typeof CreateEventPackageTranslation>>
  >(CreateEventPackageTranslation, options, {
    domain: "events",
    type: "update",
  });
};
