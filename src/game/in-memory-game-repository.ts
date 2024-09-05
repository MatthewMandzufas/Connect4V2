import { Uuid } from "@/global.d";
import {
  GameDetails,
  GameRepository,
  PersistedGameDetails,
} from "./game-service.d";

export default class InMemoryGameRepository implements GameRepository {
  #games: Map<Uuid, PersistedGameDetails>;
  constructor() {
    this.#games = new Map();
  }

  saveGame(gameDetails: GameDetails) {
    const gameUuid = crypto.randomUUID();
    const persistedGameDetails = { ...gameDetails, uuid: gameUuid };
    this.#games.set(gameUuid, persistedGameDetails);
    return Promise.resolve(persistedGameDetails);
  }

  loadGame(gameUuid: Uuid) {
    const persistedGameDetails = this.#games.get(gameUuid);
    return Promise.resolve(persistedGameDetails);
  }
}
