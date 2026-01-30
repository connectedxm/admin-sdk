import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPackageTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPackageTranslationUpdateInputs } from "@src/params";
import { EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/packages/translations/useGetEventPackageTranslations";
import { SET_EVENT_PACKAGE_TRANSLATION_QUERY_DATA } from "@src/queries/events/packages/translations/useGetEventPackageTranslation";

/**
 * @category Params
 * @group Event-Packages
 */
export interface UpdateEventPackageTranslationParams extends MutationParams {
  eventId: string;
  packageId: string;
  locale: string;
  translation: EventPackageTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const UpdateEventPackageTranslation = async ({
  eventId,
  packageId,
  locale,
  translation,
  adminApiParams,
  queryClient,
}: UpdateEventPackageTranslationParams): Promise<
  ConnectedXMResponse<EventPackageTranslation>
> => {
  if (!locale) throw new Error("Locale Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventPackageTranslation>
  >(
    `/events/${eventId}/packages/${packageId}/translations/${locale}`,
    translation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY(eventId, packageId),
    });
    SET_EVENT_PACKAGE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, packageId, locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useUpdateEventPackageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPackageTranslation>>,
      Omit<
        UpdateEventPackageTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPackageTranslationParams,
    Awaited<ReturnType<typeof UpdateEventPackageTranslation>>
  >(UpdateEventPackageTranslation, options);
};
