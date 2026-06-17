import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { client } from "../config/anthropic.js";
import { essayFeedbackSave, essayAnonymousFeedbackSave } from "../services/user.service.js";
import {dbConnection} from "../config/db.js";
import {publisher} from "../config/redispubsub.js";

dbConnection();

new Worker(
    "essay-evaluation",
    async (job) => {

        const { userId, prompt, essay } = job.data;

        console.log(
            "Processing:",
            job.id
        );

        const EVALUATOR_SYSTEM = `You are a certified IELTS Writing Task 2 examiner.

## SCORING RULES
- Score TR, CC, LR, GRA each on INTEGER bands 4–9 only (no half bands: 6.5, 7.5 are INVALID)
- Overall = average of four scores, rounded to nearest 0.5
- Evidence-first: identify strengths/weaknesses BEFORE scoring
- Quote exact phrases when citing issues
- Never hallucinate errors or praise not present in the essay
- In feedback/summary/next_steps, never use double quotes inside strings — use single quotes instead
- Never use raw newlines inside JSON string value
- Be a little bit positive

## BAND DESCRIPTORS (abbreviated — use judgment for intermediate bands)

TR: 9=fully explored+precise position | 8=well-developed | 7=clear but may over-generalise | 6=addressed but conclusions unclear | 5=incomplete, limited development | 4=minimal/tangential
CC: 9=effortless flow, skilled paragraphing | 8=logical, well-managed | 7=clear progression, minor lapses | 6=generally coherent, faulty cohesion | 5=some organisation, not fluent | 4=no clear progression
LR: 9=sophisticated+precise | 8=wide+flexible | 7=some less-common vocab, few errors | 6=adequate but restricted | 5=limited, frequent lapses | 4=basic, repetitive
GRA: 9=wide range, near-perfect | 8=mostly error-free | 7=variety of complex structures | 6=mix of simple/complex, limited | 5=limited+faulty complex | 4=very limited, frequent errors
Respond ONLY with valid JSON in this exact shape, no prose, no markdown fences:
{
  "overall": 7.0,
  "scores": { "TR": 7, "CC": 7, "LR": 6, "GRA": 7 },
  "feedback": {
    "TR": "…2–3 sentences referencing specific parts of the essay…",
    "CC": "…",
    "LR": "…",
    "GRA": "…"
  },
  "annotated_issues": [
    { "quote": "exact phrase from essay", "issue": "…", "suggestion": "…" }
  ],
  "summary": "2–3 sentence overall summary",
  "next_steps": ["concrete improvement 1", "concrete improvement 2", "concrete improvement 3"]
}`;

        console.log("anonymousUser:", job.data.anonymousUser);
        console.log("type:", typeof job.data.anonymousUser);
        console.log("full job data:", job.data);

        if(job.data.anonymousUser){
            try{
                console.log("Anonymous essay evaluation job data", job.data);

                console.log("Before Claude");

            // claude-sonnet-4-6
            // claude-haiku-4-5-20251001
            // const msg = await client.messages.create({
            //     model: "claude-haiku-4-5-20251001",
            //     max_tokens: 1500,
            //     system: EVALUATOR_SYSTEM,
            //     messages: [
            //         { role: "user", content: `TASK PROMPT:\n${prompt}\n\nCANDIDATE ESSAY:\n${essay}` },
            //     ],
            // });

                console.log("After Claude");

            // if (msg.stop_reason === "max_tokens") {
            //     throw new Error("Response truncated — increase max_tokens");
            // }

            // const raw = "{" + (msg.content[0]?.text ?? "");

            // console.log("RAW:", raw);

            // console.log("Before JSON Parse");

            // const text = msg.content[0].type === "text" ? msg.content[0].text : "";

            // const cleaned = text
            //     .trim()
            //     .replace(/^```(?:json)?\s*/i, "")  // remove opening fence
            //     .replace(/\s*```$/, "");            // remove closing fence

            // const result = JSON.parse(cleaned);

                const mockFeedback = {
                    overall: 7.0,
                    scores: {
                        TR: 7,
                        CC: 7,
                        LR: 6,
                        GRA: 7
                    },
                    feedback: {
                        TR: "The essay addresses all parts of the task...",
                        CC: "The essay is generally well-organized...",
                        LR: "A sufficient range of vocabulary is used...",
                        GRA: "A variety of grammatical structures are used..."
                    },
                    annotated_issues: [
                        {
                        quote: "people can get many benefit from technology",
                        issue: "Incorrect noun form.",
                        suggestion: "Use 'many benefits' instead of 'many benefit'."
                        }
                    ],
                    summary: "This is a well-structured essay that clearly addresses the task.",
                    next_steps: [
                        "Expand supporting examples.",
                        "Improve vocabulary range.",
                        "Reduce grammar mistakes."
                    ]
                };

                console.log("After JSON Parse");

                console.log("Before Save");

                const saveEssayEvaluation = await essayAnonymousFeedbackSave(prompt, essay, mockFeedback);
            // if(saveEssayEvaluation.message === "Essay feedback successfully saved." && saveEssayEvaluation.data.success){
            //     res.json({...result, essayId: saveEssayEvaluation.data.newEssayId});
            // }else{
            //     return res.status(500).json({
            //         message: saveEssayEvaluation.message,
            //         data: {
            //             success: false
            //         }
            //     })
            // }

                console.log("After Save");
                console.log(job.data);
                console.log(saveEssayEvaluation.data.newEssayId);

                if (!saveEssayEvaluation?.data?.success) {
                    throw new Error(
                        saveEssayEvaluation?.message ||
                        "Failed to save essay"
                    );
                }

                await publisher.publish(
                    "essay-completed",
                    JSON.stringify({
                        userId,
                        essayId: saveEssayEvaluation.data.newEssayId,
                        result: mockFeedback
                    })
                );

                return {
                    essayId: saveEssayEvaluation.data.newEssayId
                };    
            }catch(err){
                console.error("Error on anonymous essay evaluation job data", err);
            }  
        }

        try{
            console.log("Before Claude");

            // claude-sonnet-4-6
            // claude-haiku-4-5-20251001
            // const msg = await client.messages.create({
            //     model: "claude-haiku-4-5-20251001",
            //     max_tokens: 1500,
            //     system: EVALUATOR_SYSTEM,
            //     messages: [
            //         { role: "user", content: `TASK PROMPT:\n${prompt}\n\nCANDIDATE ESSAY:\n${essay}` },
            //     ],
            // });

            console.log("After Claude");

            // if (msg.stop_reason === "max_tokens") {
            //     throw new Error("Response truncated — increase max_tokens");
            // }

            // const raw = "{" + (msg.content[0]?.text ?? "");

            // console.log("RAW:", raw);

            // console.log("Before JSON Parse");

            // const text = msg.content[0].type === "text" ? msg.content[0].text : "";

            // const cleaned = text
            //     .trim()
            //     .replace(/^```(?:json)?\s*/i, "")  // remove opening fence
            //     .replace(/\s*```$/, "");            // remove closing fence

            // const result = JSON.parse(cleaned);

            const mockFeedback = {
                overall: 7.0,
                scores: {
                    TR: 7,
                    CC: 7,
                    LR: 6,
                    GRA: 7
                },
                feedback: {
                    TR: "The essay addresses all parts of the task...",
                    CC: "The essay is generally well-organized...",
                    LR: "A sufficient range of vocabulary is used...",
                    GRA: "A variety of grammatical structures are used..."
                },
                annotated_issues: [
                    {
                    quote: "people can get many benefit from technology",
                    issue: "Incorrect noun form.",
                    suggestion: "Use 'many benefits' instead of 'many benefit'."
                    }
                ],
                summary: "This is a well-structured essay that clearly addresses the task.",
                next_steps: [
                    "Expand supporting examples.",
                    "Improve vocabulary range.",
                    "Reduce grammar mistakes."
                ]
                };

            console.log("After JSON Parse");

            console.log("Before Save");

            const saveEssayEvaluation = await essayFeedbackSave(userId, prompt, essay, mockFeedback);
            // if(saveEssayEvaluation.message === "Essay feedback successfully saved." && saveEssayEvaluation.data.success){
            //     res.json({...result, essayId: saveEssayEvaluation.data.newEssayId});
            // }else{
            //     return res.status(500).json({
            //         message: saveEssayEvaluation.message,
            //         data: {
            //             success: false
            //         }
            //     })
            // }

            console.log("After Save");
            console.log(job.data);
            console.log(saveEssayEvaluation.data.newEssayId);

            if (!saveEssayEvaluation?.data?.success) {
                throw new Error(
                    saveEssayEvaluation?.message ||
                    "Failed to save essay"
                );
            }

            await publisher.publish(
                "essay-completed",
                JSON.stringify({
                    userId,
                    essayId: saveEssayEvaluation.data.newEssayId,
                    result: mockFeedback
                })
            );

            return {
                essayId: saveEssayEvaluation.data.newEssayId
            };
        }catch (err) {
            console.log("Error occured on worker thread:", err);
        }
        // const text = msg.content[0].type === "text" ? msg.content[0].text : "";

// Strip ```json ... ``` or ``` ... ``` fences if present


    },
    {
        connection: redisConnection
    }
);