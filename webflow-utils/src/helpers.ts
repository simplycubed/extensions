export const getFunctionBaseUrl = (location: string, projectId: string) => {
  return `https://${location}-${projectId}.cloudfunctions.net`;
};

export const getDatabaseUrl = (
  selectedDatabaseInstance: string | undefined,
  selectedDatabaseLocation: string | undefined
) => {
  if (!selectedDatabaseLocation || !selectedDatabaseInstance) return null;

  if (selectedDatabaseLocation === "us-central1")
    return `https://${selectedDatabaseInstance}.firebaseio.com`;

  return `https://${selectedDatabaseInstance}.${selectedDatabaseLocation}.firebasedatabase.app`;
};
