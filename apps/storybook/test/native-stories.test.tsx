import { runStories } from "./run-stories";

runStories(import.meta.glob("../src/native-stories/**/*.stories.tsx", { eager: true }));
