import { runStories } from "./run-stories";

runStories(import.meta.glob("../src/stories/[s-z]*.stories.tsx", { eager: true }));
