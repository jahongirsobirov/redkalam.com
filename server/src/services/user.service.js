import {Essay} from '../models/essay.model.js';
import {User} from '../models/user.model.js';
import {Leaderboard} from '../models/leaderboard.model.js';
import PDFDocument from "pdfkit";
import {AnonymousEssay} from '../models/anonymousessay.model.js';

export const essayFeedbackSave = async (userId, topic, essay, aiResponse) => {
    try{
        const userExists = await User.findById(userId).lean();

        if (!userExists) {
            return {
                message: 'User does not exist',
                data: {
                    success: false,
                }
            };
        }

        const newEssayEvaluation = new Essay({
            userId, topic, essay, result: aiResponse
        });

        await newEssayEvaluation.save();

        const userPreviousBestScore = await Leaderboard.findOne({ userId });

        if(!userPreviousBestScore) {
            const newBestScore = new Leaderboard({
                userId, username: userExists.username, bestEssayId: newEssayEvaluation._id, bestScore: aiResponse.overall,
            })

            await newBestScore.save();
        }else{
            if(userPreviousBestScore.bestScore >= aiResponse.overall) {
                return {
                    message: `Essay feedback successfully saved.`,
                    data: {
                        success: true,
                        newEssayId: newEssayEvaluation._id
                    }
                };
            }else{
                await Leaderboard.findOneAndUpdate({userId}, {bestEssayId: newEssayEvaluation._id, bestScore: aiResponse.overall}, {new: true});

                return {
                    message: `Essay feedback successfully saved.`,
                    data: {
                        success: true,
                        newEssayId: newEssayEvaluation._id
                    }
                };
            }
        }

        return {
            message: `Essay feedback successfully saved.`,
            data: {
                success: true,
                newEssayId: newEssayEvaluation._id
            }
        };
    }catch(err){
        console.error("Error on essayFeedbackSave",err);
    }
}

export const essayAnonymousFeedbackSave = async (topic, essay, aiResponse) => {
    try{
        // const userExists = await User.findById(userId).lean();

        // if (!userExists) {
        //     return {
        //         message: 'User does not exist',
        //         data: {
        //             success: false,
        //         }
        //     };
        // }

        const newAnonymousEssayEvaluation = new AnonymousEssay({
            topic, essay, result: aiResponse
        });

        await newAnonymousEssayEvaluation.save();

        // const userPreviousBestScore = await Leaderboard.findOne({ userId });

        // if(!userPreviousBestScore) {
        //     const newBestScore = new Leaderboard({
        //         userId, username: userExists.username, bestEssayId: newEssayEvaluation._id, bestScore: aiResponse.overall,
        //     })

        //     await newBestScore.save();
        // }else{
        //     if(userPreviousBestScore.bestScore >= aiResponse.overall) {
        //         return {
        //             message: `Essay feedback successfully saved.`,
        //             data: {
        //                 success: true,
        //                 newEssayId: newEssayEvaluation._id
        //             }
        //         };
        //     }else{
        //         await Leaderboard.findOneAndUpdate({userId}, {bestEssayId: newEssayEvaluation._id, bestScore: aiResponse.overall}, {new: true});

        //         return {
        //             message: `Essay feedback successfully saved.`,
        //             data: {
        //                 success: true,
        //                 newEssayId: newEssayEvaluation._id
        //             }
        //         };
        //     }
        // }

        return {
            message: `Essay feedback successfully saved.`,
            data: {
                success: true,
                newEssayId: newAnonymousEssayEvaluation._id
            }
        };
    }catch(err){
        console.error("Error on essayAnonymousFeedbackSave",err);
    }
}

export const getUserEssayAndFeedbackById = async (userId, limit, page) => {
    try{
        const user = await User.findById(userId).lean();
        if (!user) {
            return {
                message: 'User not found',
                data: {
                    success: false,
                }
            }
        }

        const userEssay = await Essay.find({userId}).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).lean();
        if (userEssay.length === 0) {
            return {
                message: 'Essay not found',
                data: {
                    success: false,
                }
            }
        }

        return {
            message: 'Essays and feedbacks successfully found.',
            data: {
                success: true,
                userEssay
            }
        };
    }catch(err){
        console.error("Error on getUserEssayAndFeedbackById",err);
    }
}

export const getEssayFeedbackByIdFromDb = async (essayId) => {
    try {
        const essayAndEssayFeedback = await Essay.findById(essayId).lean();

        if(!essayAndEssayFeedback) {
            return {
                message: 'Essay not found',
                data: {
                    success: false,
                }
            }
        }

        return {
            message: 'Essays feedback successfully found.',
            data: {
                success: true,
                essayAndEssayFeedback
            }
        }
    }catch(err){
        console.error("Error on getEssayFeedbackByIdFromDb",err);
    }
}

export const getUserIELTSScores = async (userId) => {
    try {
        // const userIELTSScores = await Essay.find({userId}).lean();

        const THIRTY_DAYS_AGO = new Date();

        THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

        const userIELTSScores = await Essay.find({
            userId,
            createdAt: {
                $gte: THIRTY_DAYS_AGO
            }
        })
            .select("result.overall createdAt")
            .sort({ createdAt: 1 })
            .lean();

        if(userIELTSScores.length === 0){
            return {
                message: 'IELTS scores not found',
                data: {
                    success: false,
                }
            }
        }

        return {
            message: 'IELTS scores successfully found.',
            data: {
                success: true,
                scores: userIELTSScores
            }
        }
    }catch(err){
        console.error("Error on getUserIELTSScores",err);
    }
}

export const getLeaderBoardFromDb = async () => {
    try{
        const leaderboard = await Leaderboard.find().lean().select("username bestScore").sort({ bestScore: -1 }).limit(10);
        if(leaderboard.length === 0){
            return {
                message: 'Leaderboard not found',
                data: {
                    success: false,
                }
            }
        }

        return {
            message: 'Leaderboard successfully found.',
            data: {
                success: true,
                leaderboard
            }
        }
    }catch(err){
        console.error("Error on getLeaderBoardFromDb",err);
        return {
            message: `Error on getting leader board from Db: ${err}`,
            data: {
                success: false,
            }
        };
    }
}

export const getEssayFeedbackFromDbForPDFFile = async (essayId) => {
    try {
        const essayFeedback = await Essay.findById(essayId).lean();

        if(!essayFeedback) {
            return {
                message: 'Essay feedback not found',
                data: {
                    success: false,
                }
            }
        }

        const doc = new PDFDocument();

        const chunks = [];

        doc.on("data", chunk => chunks.push(chunk));

        const pdfBuffer = await new Promise((resolve, reject) => {
            doc.on("end", ()=> resolve(Buffer.concat(chunks)));

            doc.on("error", reject);

            // Header
            doc.fontSize(14).text("Topic:", {underline: true});
            doc.fontSize(12).text(essayFeedback.topic);

            doc.moveDown();

            // Essay
            doc.fontSize(14).text("Essay:", { underline: true });
            doc.fontSize(11).text(essayFeedback.essay);

            doc.moveDown();

            // Scores
            doc.fontSize(14).text("Scores:", { underline: true });

            const scores = essayFeedback.result.scores;

            doc.fontSize(12)
                .text(`Overall: ${essayFeedback.result.overall}`)
                .text(`TR: ${scores.TR}`)
                .text(`CC: ${scores.CC}`)
                .text(`LR: ${scores.LR}`)
                .text(`GRA: ${scores.GRA}`);

            doc.moveDown();

            // Feedback
            doc.fontSize(14).text("Feedback:", { underline: true });

            const feedback = essayFeedback.result.feedback;

            for (const key in feedback) {
                doc.moveDown(0.5);
                // doc.fontSize(12).text(`${key}:`, { bold: true });
                // doc.fontSize(11).text(feedback[key]);

                doc.font("Helvetica-Bold").text(`${key}:`);
                doc.font("Helvetica").text(feedback[key]);
            }

            doc.moveDown();

            // Annotated issues
            doc.fontSize(14).text("Annotated Issues:", { underline: true });

            essayFeedback.result.annotated_issues.forEach((issue, i) => {
                doc.moveDown(0.5);

                doc.fontSize(11).text(`${i + 1}. Quote: ${issue.quote}`);
                doc.text(`Issue: ${issue.issue}`);
                doc.text(`Suggestion: ${issue.suggestion}`);
            });

            doc.moveDown();

            // Summary
            doc.fontSize(14).text("Summary:", { underline: true });
            doc.fontSize(11).text(essayFeedback.result.summary);

            doc.moveDown();

            // Next Steps
            doc.fontSize(14).text("Next Steps:", { underline: true });

            essayFeedback.result.next_steps.forEach((step, i) => {
                doc.fontSize(11).text(`${i + 1}. ${step}`);
            });

            doc.end();
        });

        return pdfBuffer;
    }catch(err){
        console.error("Error on getEssayFeedbackFromDbForPDFFile",err);
    }
}