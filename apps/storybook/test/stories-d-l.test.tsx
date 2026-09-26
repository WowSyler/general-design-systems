import { runStories } from "./run-stories";

runStories(import.meta.glob("../src/stories/[d-l]*.stories.tsx", { eager: true }));
