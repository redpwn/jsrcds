import r from "@rcds/packages";

const deploy = r.image({ path: "src" });
const build = r.image({ path: "src/build" });

const network = r.network({
  target: 5000,
  tcp: 31040,
  healthContent: "proof of work",
  container: deploy,
});

const fileUrls = r.media({
  files: [
    "src/boogie-woogie.c",
    {
      name: "boogie-woogie",
      content: build.get_file("/app/boogie-woogie"),
    },
  ],
});

r.challenge({
  name: "boogie-woogie",
  author: "pepsipu",
  description: `i've been watching too much jjk\n ${network.nc}`,
  provides: fileUrls,
});
