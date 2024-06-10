import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { BenefitTranslation } from "@src/interfaces";
import { BENEFIT_TRANSLATIONS_QUERY_KEY } from "./useGetBenefitTranslations";

export const BENEFIT_TRANSLATION_QUERY_KEY = (
  benefitId: string,
  locale: string
) => [...BENEFIT_TRANSLATIONS_QUERY_KEY(benefitId), locale];

export const SET_BENEFIT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BENEFIT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefitTranslation>>
) => {
  client.setQueryData(BENEFIT_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetBenefitTranslationProps {
  benefitId: string;
  locale: string;
}

export const GetBenefitTranslation = async ({
  benefitId,
  locale,
}: GetBenefitTranslationProps): Promise<
  ConnectedXMResponse<BenefitTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/benefits/${benefitId}/translations/${locale}`
  );
  return data;
};

const useGetBenefitTranslation = (benefitId: string, locale: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBenefitTranslation>>((
    BENEFIT_TRANSLATION_QUERY_KEY(benefitId, locale),
    () =>
      GetBenefitTranslation({
        benefitId,
        locale,
      }),
    {
      enabled: !!benefitId && !!locale,
    }
  );
};

export default useGetBenefitTranslation;
