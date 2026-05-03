import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    await db.insert(schema.courses).values([
      { id: 1, title: "Spanish", imageSrc: "/es.svg" },
      { id: 2, title: "Italian", imageSrc: "/it.svg" },
      { id: 3, title: "French", imageSrc: "/fr.svg" },
      { id: 4, title: "Uzbek", imageSrc: "/uz.svg" },
    ]);

    await db.insert(schema.units).values([
      { id: 1, courseId: 1, title: "Unit 1", description: "Learn the basics of Spanish", order: 1 }
    ]);

    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, order: 1, title: "Nouns" },
      { id: 2, unitId: 1, order: 2, title: "Verbs" },
      { id: 3, unitId: 1, order: 3, title: "Adjectives" },
      { id: 4, unitId: 1, order: 4, title: "Phrases" },
      { id: 5, unitId: 1, order: 5, title: "Review" },
    ]);

    // Pool of available items to mix and match
    const items = [
      { es: "el hombre", en: "the man", audio: "/es_man.mp3", img: "/man.svg" },
      { es: "la mujer", en: "the woman", audio: "/es_woman.mp3", img: "/woman.svg" },
      { es: "el robot", en: "the robot", audio: "/es_robot.mp3", img: "/robot.svg" },
      { es: "el chico", en: "the boy", audio: "/es_boy.mp3", img: "/boy.svg" },
      { es: "la niña", en: "the girl", audio: "/es_girl.mp3", img: "/girl.svg" },
      { es: "el zombi", en: "the zombie", audio: "/es_zombie.mp3", img: "/zombie.svg" }
    ];

    // Distribute items across the 5 lessons (Now using 5 parts/challenges per lesson)
    const lessonsConfig = [
      { lessonId: 1, items: [items[0], items[1], items[2], items[3], items[4]] },
      { lessonId: 2, items: [items[3], items[4], items[5], items[0], items[1]] },
      { lessonId: 3, items: [items[0], items[3], items[5], items[2], items[4]] },
      { lessonId: 4, items: [items[1], items[4], items[2], items[0], items[3]] },
      { lessonId: 5, items: [items[2], items[5], items[0], items[1], items[3]] },
    ];

    let challengeIdCounter = 1;

    for (const config of lessonsConfig) {
      const lItems = config.items;
      
      // Part 1: SELECT
      await db.insert(schema.challenges).values({
        id: challengeIdCounter, lessonId: config.lessonId, type: "SELECT", order: 1, question: `Which one of these is "${lItems[0].en}"?`
      });
      await db.insert(schema.challengeOptions).values([
        { challengeId: challengeIdCounter, imageSrc: lItems[0].img, correct: true, text: lItems[0].es, audioSrc: lItems[0].audio },
        { challengeId: challengeIdCounter, imageSrc: lItems[1].img, correct: false, text: lItems[1].es, audioSrc: lItems[1].audio },
        { challengeId: challengeIdCounter, imageSrc: lItems[2].img, correct: false, text: lItems[2].es, audioSrc: lItems[2].audio },
      ]);
      challengeIdCounter++;

      // Part 2: ASSIST (No imageSrc to prevent broken image column layouts)
      await db.insert(schema.challenges).values({
        id: challengeIdCounter, lessonId: config.lessonId, type: "ASSIST", order: 2, question: `"${lItems[1].en}"`
      });
      await db.insert(schema.challengeOptions).values([
        { challengeId: challengeIdCounter, correct: false, text: lItems[0].es, audioSrc: lItems[0].audio },
        { challengeId: challengeIdCounter, correct: true, text: lItems[1].es, audioSrc: lItems[1].audio },
        { challengeId: challengeIdCounter, correct: false, text: lItems[2].es, audioSrc: lItems[2].audio },
      ]);
      challengeIdCounter++;

      // Part 3: SELECT
      await db.insert(schema.challenges).values({
        id: challengeIdCounter, lessonId: config.lessonId, type: "SELECT", order: 3, question: `Which one of these is "${lItems[2].en}"?`
      });
      await db.insert(schema.challengeOptions).values([
        { challengeId: challengeIdCounter, imageSrc: lItems[0].img, correct: false, text: lItems[0].es, audioSrc: lItems[0].audio },
        { challengeId: challengeIdCounter, imageSrc: lItems[1].img, correct: false, text: lItems[1].es, audioSrc: lItems[1].audio },
        { challengeId: challengeIdCounter, imageSrc: lItems[2].img, correct: true, text: lItems[2].es, audioSrc: lItems[2].audio },
      ]);
      challengeIdCounter++;

      // Part 4: ASSIST
      await db.insert(schema.challenges).values({
        id: challengeIdCounter, lessonId: config.lessonId, type: "ASSIST", order: 4, question: `"${lItems[3].en}"`
      });
      await db.insert(schema.challengeOptions).values([
        { challengeId: challengeIdCounter, correct: false, text: lItems[1].es, audioSrc: lItems[1].audio },
        { challengeId: challengeIdCounter, correct: true, text: lItems[3].es, audioSrc: lItems[3].audio },
        { challengeId: challengeIdCounter, correct: false, text: lItems[4].es, audioSrc: lItems[4].audio },
      ]);
      challengeIdCounter++;

      // Part 5: SELECT
      await db.insert(schema.challenges).values({
        id: challengeIdCounter, lessonId: config.lessonId, type: "SELECT", order: 5, question: `Which one of these is "${lItems[4].en}"?`
      });
      await db.insert(schema.challengeOptions).values([
        { challengeId: challengeIdCounter, imageSrc: lItems[4].img, correct: true, text: lItems[4].es, audioSrc: lItems[4].audio },
        { challengeId: challengeIdCounter, imageSrc: lItems[2].img, correct: false, text: lItems[2].es, audioSrc: lItems[2].audio },
        { challengeId: challengeIdCounter, imageSrc: lItems[0].img, correct: false, text: lItems[0].es, audioSrc: lItems[0].audio },
      ]);
      challengeIdCounter++;
    }

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
