// await Promise.all(
//     (config.provide ?? []).map(async (entry) => {
//       if (entry.url) {
//         // dont upload file if url is provided
//         return {
//           name: entry.as ?? path.posix.basename(new URL(entry.url).pathname),
//           url: entry.url,
//         };
//       }
//       const filePath = path.join(dir, entry.file ?? entry);
//       const name = entry.as ?? path.basename(filePath);
//       const hash = await hashFile(filePath);
//       const key = `${rootConfig.uploads.prefix}/${hash}/${name}`;
//       return {
//         name,
//         filePath,
//         key,
//         url: `https://${getBucketHost(rootConfig.uploads.bucket)}/${key}`,
//       };
//     })
//   )
