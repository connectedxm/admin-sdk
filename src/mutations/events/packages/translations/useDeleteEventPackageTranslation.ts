import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/packages/translations/useGetEventPackageTranslations";
import { EVENT_PACKAGE_TRANSLATION_QUERY_KEY } from "@src/queries/events/packages/translations/useGetEventPackageTranslation";

/**
 * @category Params
 * @group Event-Packages
 */
export interface DeleteEventPackageTranslationParams extends MutationParams {
  eventId: string;
  packageId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const DeleteEventPackageTranslation = async ({
  eventId,
  packageId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventPackageTranslationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/packages/${packageId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY(eventId, packageId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_PACKAGE_TRANSLATION_QUERY_KEY(eventId, packageId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useDeleteEventPackageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPackageTranslation>>,
      Omit<
        DeleteEventPackageTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPackageTranslationParams,
    Awaited<ReturnType<typeof DeleteEventPackageTranslation>>
  >(DeleteEventPackageTranslation, options);
};
