import { ChainFactoryBuilder, ChainFactoryConfigs } from "emmet.js/dist";
import { ChainFactory } from "emmet.js/dist/factory/types";

export const chainFactory: ChainFactory = await ChainFactoryBuilder(
  ChainFactoryConfigs.MainNet()
);
