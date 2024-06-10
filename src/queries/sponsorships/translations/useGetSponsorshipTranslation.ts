import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipTranslation } from "@src/interfaces";
import { SPONSORSHIP_TRANSLATIONS_QUERY_KEY } from "./useGetSponsorshipTranslations";

export const SPONSORSHIP_TRANSLATION_QUERY_KEY = (
  sponsorshipId: string,
  locale: string
) => [...SPONSORSHIP_TRANSLATIONS_QUERY_KEY(sponsorshipId), locale];

export const SET_SPONSORSHIP_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SPONSORSHIP_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorshipTranslation>>
) => {
  client.setQueryData(
    SPONSORSHIP_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSponsorshipTranslationProps {
  sponsorshipId: string;
  locale: string;
}

export const GetSponsorshipTranslation = async ({
  sponsorshipId,
  locale,
}: GetSponsorshipTranslationProps): Promise<
  ConnectedXMResponse<SponsorshipTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/sponsorships/${sponsorshipId}/translations/${locale}`
  );
  return data;
};

const useGetSponsorshipTranslation = (
  sponsorshipId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSponsorshipTranslation>>((
    SPONSORSHIP_TRANSLATION_QUERY_KEY(sponsorshipId, locale),
    () =>
      GetSponsorshipTranslation({
        sponsorshipId,
        locale,
      }),
    {
      enabled: !!sponsorshipId && !!locale,
    }
  );
};

export default useGetSponsorshipTranslation;
