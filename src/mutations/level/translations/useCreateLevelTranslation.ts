import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SponsorshipLevelTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  LEVEL_TRANSLATIONS_QUERY_KEY,
  SET_LEVEL_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Level-Translations
 */
export interface CreateLevelTranslationParams extends MutationParams {
  levelId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Level-Translations
 */
export const CreateLevelTranslation = async ({
  levelId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateLevelTranslationParams): Promise<
  ConnectedXMResponse<SponsorshipLevelTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<SponsorshipLevelTranslation>
  >(`/levels/${levelId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LEVEL_TRANSLATIONS_QUERY_KEY(levelId),
    });

    SET_LEVEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [levelId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Level-Translations
 */
export const useCreateLevelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateLevelTranslation>>,
      Omit<CreateLevelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateLevelTranslationParams,
    Awaited<ReturnType<typeof CreateLevelTranslation>>
  >(CreateLevelTranslation, options, {
    domain: "sponsors",
    type: "update",
  });
};
