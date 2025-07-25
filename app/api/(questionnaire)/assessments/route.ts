import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role !== "hr") {
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }
    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    try {
        const rawdata = await req.json();
        const data = rawdata.map((e: any) => ({
            idAssessmentType: e.idAssessmentType,
            titleAT: e.titleAT,
            descAT: e.descAT,
            typeAT: e.typeAT,
            idForm: e.idForm,
        }));
        
        const dataInvolvedPos = rawdata.flatMap((e: any) =>
            e.InvolvedPosition.map((e_: any) => ({
                idAssessmentType: e_.idAssessmentType,
                idPosition: parseInt(e_.idPosition),
            }))
        );
        
        const dataQuestions = rawdata.flatMap((e: any) =>
            e.Questions.map((e_: any) => ({
                idQuestion: e_.idQuestion,
                titleQue: e_.titleQue,
                Question: e_.Question,
                idAT: e.idAssessmentType,
            }))
        );
        

        const [createdAssessmentType, createdInvolvedPos, createdQuestions] = await prisma.$transaction([
            prisma.assessmentType.createMany({
                data: data,
            }),
            prisma.involvedPosition.createMany({
                data: dataInvolvedPos,
            }),
            prisma.questions.createMany({
                data: dataQuestions,
            }),
        ]);    
        return NextResponse.json({
            createdAssessmentType,
            createdInvolvedPos,
            createdQuestions,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: `Prisma Error with code ${error.code}`, message: (error as any).message }, { status: 400 });
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error('Unknown Prisma error:', error.message);
            return NextResponse.json({ error: `Unknown Prisma error with message : ${error.message}`, message: (error as any).message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
        }
    }
}