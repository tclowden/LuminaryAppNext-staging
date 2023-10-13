export const LEADS_COUNT_BY_SOURCE_ID_QUERY = `
   (
      SELECT 
         COUNT(*) 
      FROM leads 
      WHERE 
         leads."leadSourceId" = "leadSources".id 
      AND 
         "ownerId" IS NULL 
      AND 
         "bucketId" IS NULL
   )`;

export const LEADS_COUNT_BY_STATUS_ID_QUERY = `
(
   SELECT 
      COUNT(*) 
   FROM leads 
   WHERE 
      leads."statusId" = "statuses".id 
   AND 
      "ownerId" IS NULL 
   AND 
      "bucketId" IS NULL
)`;
