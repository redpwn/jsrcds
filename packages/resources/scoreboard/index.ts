export interface ChallengeObject { }

export interface Scoreboard {
  createChallenge(challenge: ChallengeObject): void;
}