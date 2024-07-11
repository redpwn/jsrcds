// we validate challenges in three ways:
// 1. validateConfig checks config against json schema
// 2. validateChallenge checks dependencies for individual challenges (dockerfiles exist, flag is correct format, etc)
// 3. validateChallenges checks that all challenges are unique (no duplicate ids, ports, etc)

const flagRegex = new RegExp(rootConfig.flagRegex);
const validateChallenge = async (challenge) => {
  if (!/^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/.test(challenge.id)) {
    throw new Error(`invalid id: ${challenge.segment}: ${challenge.id}`);
  }
  if (!flagRegex.test(challenge.flag)) {
    throw new Error(`invalid flag: ${challenge.segment}: ${challenge.flag}`);
  }
  // provides are alredy implicitly checked by hashFile
  for (const [name, container] of Object.entries(challenge.containers)) {
    if (!container.build) {
      continue;
    }
    const dockerfile = path.join(
      repoRoot,
      challenge.segment,
      container.build.context,
      container.build.dockerfile
    );
    const stat = await fs.promises.stat(dockerfile);
    if (stat.size === 0) {
      throw new Error(
        `empty dockerfile: ${challenge.segment}/${name}: ${dockerfile}`
      );
    }
  }
  for (const [name, exposes] of Object.entries(challenge.expose)) {
    for (const [i, expose] of exposes.entries()) {
      // TODO: move this check to kubernetes provider after moving plan stage to setup job
      if (
        rootConfig.deploy.kubernetes &&
        expose.tcp !== undefined &&
        (expose.tcp < 30000 || expose.tcp > 32767)
      ) {
        throw new Error(
          `invalid tcp port: ${challenge.segment}/${name}/${i}: ${expose.tcp}`
        );
      }
    }
  }
};

const validateChallenges = (challenges) => {
  const ids = new Set();
  const ports = new Set();
  const hosts = new Set();
  for (const challenge of challenges) {
    if (ids.has(challenge.id)) {
      throw new Error(`duplicate id: ${challenge.segment}: ${challenge.id}`);
    }
    ids.add(challenge.id);
    for (const [name, exposes] of Object.entries(challenge.expose)) {
      for (const [i, expose] of exposes.entries()) {
        const id = `${challenge.segment}/${name}/${i}`;
        if (expose.tcp) {
          if (ports.has(expose.tcp)) {
            throw new Error(`duplicate tcp port: ${id}: ${expose.tcp}`);
          }
          ports.add(expose.tcp);
        }
        if (expose.http) {
          if (hosts.has(expose.http)) {
            throw new Error(`duplicate http host: ${id}: ${expose.http}`);
          }
          hosts.add(expose.http);
        }
        if (expose.tls) {
          if (hosts.has(expose.tls)) {
            throw new Error(`duplicate tls host: ${id}: ${expose.tls}`);
          }
          hosts.add(expose.tls);
        }
      }
    }
  }
};
