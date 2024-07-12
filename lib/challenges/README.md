the challenges module, broadly:

- loads challenges from a desired format (a challenge repo on the file system, some api endpoint, one big json file, whatever) to create a valid ChallengeConfig.
  - a loader may partially hydrate ChallengeConfig (such as generating the challenge segment from its location in a file system)
- validates challenges individually and as a group, returning human-readable errors if neccessary
- hydrates the challenges with defaults and derived values (such as rendering the description of the challenge)

these steps are interweaved :100:

its goal is to provide a standardized and valid list of challenges.
