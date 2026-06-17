import { useState, useEffect } from "react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent } from "../components/ui/card.jsx";
// import {useAuth} from "../hooks/auth.hook.jsx";
// import DashboardSkeleton from "../components/ui/dashboard.skeleton.jsx";
import {navigate} from "../Router.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import {serverHost} from "../config/serverhost.jsx";
import { Copy } from "lucide-react";
import {socket} from "../socket.js";

export default function WriteAnonymouslyPage() {
    const [essay, setEssay] = useState("");
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [sufficientWordCount, setSufficientWordCount] = useState(false);
    // const isAuth = useAuth();

    // Load draft
    useEffect(() => {
        const saved = localStorage.getItem("essayDraft");
        if (saved) {
            setEssay(saved);
        }

        const savedTopic = localStorage.getItem("essayTopicDraft");
        if (savedTopic) {
            setTopic(savedTopic);
        }
    }, []);

    // Save draft
    useEffect(() => {
        if (essay.trim()) {
            localStorage.setItem("essayDraft", essay);
        }

        if(topic?.trim()) {
            localStorage.setItem("essayTopicDraft", topic);
        }
    }, [essay, topic]);

    // 👉 NOW you can do conditional returns safely

    // if (isAuth === null) return <DashboardSkeleton />;
    //
    // if (!isAuth) {
    //     navigate("/login");
    //     return null;
    // }

    const loadingMessages = [
        "Analyzing your essay...",
        "Checking grammar...",
        "Evaluating vocabulary...",
        "Calculating band score..."
    ];

    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setMessageIndex(prev =>
                (prev + 1) % loadingMessages.length
            );
        }, 2000);

        return () => clearInterval(interval);
    }, [loading]);

    const wordCount = essay.trim()
        ? essay.trim().split(/\s+/).length
        : 0;

    useEffect(() => {

        const handleAnonymousEssayCompleted = (data) => {

            console.log("Essay completed:", data);

            setResult(data.result);
            // setEssayIdForDownloadPDF(data.essayId);

            setLoading(false);
        };

        socket.on(
            "essay-completed",
            handleAnonymousEssayCompleted
        );

        return () => {
            socket.off(
                "essay-completed",
                handleAnonymousEssayCompleted
            );
        };

    }, []);

    const handleAnonymSubmit = async () => {
        try{
            setLoading(true);
            // console.log("Essay:", essay);
            // send to backend / AI

            if(wordCount < 50){
                setSufficientWordCount(true);
                return;
            }

            // const userToken = localStorage.getItem("userToken") ?? 'Unknown';

            const anonymousEssayEvaluationRes = await fetch(`${serverHost}/api/user/essay/anonymous/evaluate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    prompt: topic,
                    essay
                })
            });

            const anonymousEssayEvaluationResData = await anonymousEssayEvaluationRes.json();

            if (!anonymousEssayEvaluationRes.ok) {
                console.log("Anonymous essay evaluation res data", anonymousEssayEvaluationResData);
            }

            console.log(anonymousEssayEvaluationResData);
            localStorage.setItem("anonymousUserId", anonymousEssayEvaluationResData.data.userId);
            console.log("anonymousUserId", anonymousEssayEvaluationResData.data.userId);

            // setResult(anonymousEssayEvaluationResData);
            localStorage.removeItem("essayDraft");
            localStorage.removeItem("essayTopicDraft");

            socket.emit("join", anonymousEssayEvaluationResData.data.userId ?? 'Unknown');
        }catch(err){
            console.error("Error occured on handleSubmit()",err);
        }finally {
            setLoading(false);
        }
    };

    const handleCopyFeedback = async () => {
        if (!result) return;

        const text = `
            Overall IELTS Band: ${result.overall}
            
            Summary:
            ${result.summary}
            
            Scores:
            ${Object.entries(result.scores)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join("\n")}
            
            Detailed Feedback:
            ${Object.entries(result.feedback)
                        .map(([key, value]) => `${key}:\n${value}`)
                        .join("\n\n")}
            
            Improvements:
            ${result.annotated_issues
                        .map(
                            (issue, i) =>
                                `${i + 1}. "${issue.quote}"
            Issue: ${issue.issue}
            Suggestion: ${issue.suggestion}`
                        )
                        .join("\n\n")}
            
            Next Steps:
            ${result.next_steps
                        .map((step, i) => `${i + 1}. ${step}`)
                        .join("\n")}
        `;

        await navigator.clipboard.writeText(text);

        // alert("Copied to clipboard!");
    };

    // const handlePDFFileDownload = async (essayId) => {
    //     try{
    //         const userToken = localStorage.getItem("userToken") ?? 'Unknown';
    //         const res = await fetch(`api/user/essay/feedback/${essayId}/download/pdf`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${userToken}`
    //             }
    //         });
    //
    //         // const data = await res.json();
    //         // const text = await res.text();
    //         // console.log("Response of handlePDFFileDownload()", data);
    //         // console.log("Response of handlePDFFileDownload()", text);
    //         if(!res.ok){
    //             console.log("Essay feedback pdf download res data", res);
    //         }
    //
    //         const blob = await res.blob(); // ✅
    //
    //         const url = window.URL.createObjectURL(blob);
    //
    //         const a = document.createElement("a");
    //
    //         a.href = url;
    //         a.download = "essay-feedback.pdf";
    //
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();
    //
    //         window.URL.revokeObjectURL(url);
    //     }catch(err){
    //         console.error("Error occured on handlePDFFileDownload()",err);
    //     }
    // }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar activePage={"writing"} />

            <section className="max-w-4xl mx-auto px-6 py-16">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-center">
                    Write Your IELTS Essay
                </h1>
                <p className="text-gray-600 text-center mt-4">
                    Paste or write your Task 2 essay below and get instant AI feedback.
                </p>

                {/* Card */}
                <Card className="mt-10 rounded-2xl shadow-sm">

                    {/*{wordCount > 300 && (*/}
                    {/*    <p className="text-red-500 text-sm mt-2 m-3 p-3">*/}
                    {/*        Essay is too long. Recommended: 250–300 words.*/}
                    {/*    </p>*/}
                    {/*)}*/}

                    {sufficientWordCount && (
                        <p className="text-red-500 text-sm mt-2 m-3 p-3">
                            Essay is too short. Recommended: 250–300 words.
                        </p>
                    )}


                    <CardContent className="p-6">

                        {/* Topic Input (single field) */}
                        <textarea
                            rows={2}
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter essay topic..."
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        />

                        {/* Textarea */}
                        <textarea
                            value={essay}
                            onChange={(e) => setEssay(e.target.value)}
                            placeholder="Start writing your essay here..."
                            className="w-full h-64 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        />

                        {/* Bottom Bar */}
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-500">
                                Word count: {wordCount}
                            </span>

                            <Button
                                onClick={handleAnonymSubmit}
                                className="rounded-full px-6 py-2"
                                disabled={wordCount < 50 || loading}
                            >
                                {loading && (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </>
                                )}

                                {loading ? "Evaluating..." : "Get feedback"}
                            </Button>
                        </div>
                        <div>
                            {loading && (
                                <p className="text-sm text-gray-500 mt-2">
                                    {loadingMessages[messageIndex]}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                {result && (
                    <div className="mt-10 space-y-6">
                        <div className="flex flex-row justify-end">
                            <Button
                                onClick={handleCopyFeedback}
                                className="rounded-full px-6 py-2 flex items-center gap-2"
                            >
                                <Copy className="h-4 w-4" />
                                Copy Feedback
                            </Button>
                        </div>

                        {/*<div className="flex flex-row justify-end">*/}
                        {/*    <Button onClick={()=> handlePDFFileDownload(result.essayId)} className="rounded-full px-6 py-2">Download PDF</Button>*/}
                        {/*</div>*/}
                        {/* Overall Score */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-500 text-sm">
                                    Overall IELTS Band
                                </p>

                                <h2 className="text-6xl font-bold mt-2">
                                    {result.overall}
                                </h2>

                                <p className="text-gray-600 mt-4">
                                    {result.summary}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            {Object.entries(result.scores).map(([key, value]) => (
                                <Card key={key} className="rounded-2xl">
                                    <CardContent className="p-6 text-center">
                                        <p className="text-gray-500 text-sm">
                                            {key}
                                        </p>

                                        <h3 className="text-3xl font-bold mt-2">
                                            {value}
                                        </h3>
                                    </CardContent>
                                </Card>
                            ))}

                        </div>

                        {/* Feedback */}
                        <Card className="rounded-2xl">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-bold mb-6">
                                    Detailed Feedback
                                </h3>

                                <div className="space-y-6">

                                    {Object.entries(result.feedback).map(([key, value]) => (
                                        <div key={key}>
                                            <h4 className="font-semibold text-lg">
                                                {key}
                                            </h4>

                                            <p className="text-gray-700 mt-2 leading-7">
                                                {value}
                                            </p>
                                        </div>
                                    ))}

                                </div>
                            </CardContent>
                        </Card>

                        {/* Annotated Issues */}
                        <Card className="rounded-2xl">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-bold mb-6">
                                    Improvements
                                </h3>

                                <div className="space-y-5">

                                    {result.annotated_issues.map((issue, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-xl p-4"
                                        >
                                            <p className="font-medium text-red-500">
                                                "{issue.quote}"
                                            </p>

                                            <p className="mt-2 text-gray-700">
                                                {issue.issue}
                                            </p>

                                            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                                <p className="text-sm text-green-800">
                                                    {issue.suggestion}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </CardContent>
                        </Card>

                        {/* Next Steps */}
                        <Card className="rounded-2xl">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-bold mb-4">
                                    Next Steps
                                </h3>

                                <ul className="space-y-3">

                                    {result.next_steps.map((step, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3"
                                        >
                            <span className="font-bold">
                                {index + 1}.
                            </span>

                                            <span className="text-gray-700">
                                {step}
                            </span>
                                        </li>
                                    ))}

                                </ul>
                            </CardContent>
                        </Card>

                    </div>
                )}
            </section>
        </div>
    );
}