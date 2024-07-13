// provide: z
// .array(
//   z.union([
//     z.string().describe("Path to the file to provide"),
//     z
//       .object({
//         url: z
//           .string()
//           .regex(/^https?:\/\//)
//           .optional()
//           .describe("URL to download the file from"),
//         file: z
//           .string()
//           .optional()
//           .describe("Path to the file to provide"),
//         as: z
//           .string()
//           .optional()
//           .describe("Name of file as shown to competitors"),
//       })
//       .strict()
//       .refine((data: any) => data.url || data.file, {
//         message: "Either url or file must be provided",
//       }),
//   ])
// )
// .optional()
// .describe("Static files to provide to competitors"),

// const hashFile = (name) =>
//     new Promise((resolve, reject) => {
//       const hash = crypto.createHash("sha256");
//       const stream = fs.createReadStream(name);
//       stream.on("error", reject);
//       stream.pipe(hash);
//       stream.on("end", () => resolve(hash.digest("hex")));
//     });

//   const getBucketHost = (name) => {
//     if (name.includes(".")) {
//       return name;
//     }
//     return `${name}.storage.googleapis.com`;
//   };
