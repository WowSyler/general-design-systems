import { runStories } from "./run-stories";

runStories(import.meta.glob("../src/stories/[a-c]*.stories.tsx", { eager: true }));
