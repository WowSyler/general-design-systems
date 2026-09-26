import { runStories } from "./run-stories";

runStories(import.meta.glob("../src/stories/[m-r]*.stories.tsx", { eager: true }));
