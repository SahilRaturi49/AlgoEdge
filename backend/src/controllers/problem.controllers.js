import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            error: "You are not authorized to create a problem"
        });
    }

    try {
        // ✅ Validate all reference solutions first
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    error: `Language ${language} is not supported`
                });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`
                    });
                }
            }
        }

        // ✅ Create the problem only after all validations passed
        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: newProblem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while creating problem",
        });
    }
};


export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();

        if (!problems) {
            return res.status(404).json({
                error: "No problem found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error While Fetching Problems",
        });
    }

}
export const getProblemById = async (req, res) => {
    const { id } = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                id,
            },
        });

        if (!problem) {
            return res.status(404).json({
                error: "Problem not found"
            })
        };

        return res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while fetching problem by id",
        })
    }

}
export const updateProblem = async (req, res) => {
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "You are not authorized to update a problem"
        });
    };

    try {
        const existingProblem = await db.problem.findUnique({
            where: {
                id,
            },
        });

        if (!existingProblem) {
            return res.status(404).json({
                error: "Problem not found",
            });
        };
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);
            console.log(languageId);


            if (!languageId) {
                return res.status(400).json({
                    error: `Language ${language} is not supported`
                });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }))

            const submissionResults = await submitBatch(submissions);

            const tokens = submissionResults.map((res) => res.token);

            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                console.log("Result--------", result);


                if (result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`
                    });
                }

            }
        }
        const updatedProblem = await db.problem.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id
            }
        });

        res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            updatedProblem,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error while updating problem" });
    }
}


export const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await db.problem.findUnique({
            where: {
                id,
            }
        });

        if (!problem) {
            return res.status(404).json({
                error: "Problem not found",
            });
        };

        await db.problem.delete({
            where: {
                id,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error While deleting the problem",
        });
    }

}
export const getAllProblemsSolvedByUser = async (req, res) => {
    try {
        const problems = await db.problem.findMany({
            where: {
                solvedBy: {
                    some: {
                        userId: req.user.id
                    }
                }
            },
            include: {
                solvedBy: {
                    where: {
                        userId: req.user.id
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems
        })
    } catch (error) {
        console.error("Error fetching problems :", error);
        res.status(500).json({ error: "Failed to fetch problems" })
    }

}
