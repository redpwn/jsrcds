import type { Loader, LoaderConfig } from "./loader";

export const getChallenges = async (
  loader: Loader<LoaderConfig>,
): Promise<{
  challenges: any[];
  errors: any[];
}> => {
  return { challenges: await loader.getChallenges(), errors: [] };
};
