import mongoose from 'mongoose';

const AnnotatedIssueSchema = new mongoose.Schema({
    quote: String,
    issue: String,
    suggestion: String
}, { _id: false });

const EssaySchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },

    topic: {
        type: String,
        required: true
    },

    essay: {
        type: String,
        required: true
    },

    result: {
        overall: {
            type: Number,
            min: 0,
            max: 9
        },

        scores: {
            TR: Number,
            CC: Number,
            LR: Number,
            GRA: Number
        },

        feedback: {
            TR: String,
            CC: String,
            LR: String,
            GRA: String
        },

        annotated_issues: [AnnotatedIssueSchema],

        summary: String,

        next_steps: [String]
    }

}, { timestamps: true });

export const AnonymousEssay = mongoose.model('AnonymousEssay', EssaySchema);