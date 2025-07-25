import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    try {
        const data = await req.json();
        console.log("DATANYA DI SINI...");
        console.log(data);

        const result  = await prisma.$transaction(
            [
                prisma.dataRiwayatKarir.update({
                    where: { idCareerHistory: data.careerHistory[0].idCareerHistory },
                    data: {
                        position: data.careerHistory[0].position,
                        levelPosition: data.careerHistory[0].levelPosition,
                        personnelArea: data.careerHistory[0].personnelArea,
                        personnelSubarea: data.careerHistory[0].personnelSubarea,
                        tanggalMulai: data.careerHistory[0].tanggalMulai,
                        tanggalBerakhir: data.careerHistory[0].tanggalBerakhir,
                        status: data.careerHistory[0].status,
                        DataKaryawan: {      
                            connect: { nomorIndukKaryawan: session.user.nik }
                        }
                    },
                }),
                ...(Array.isArray(data.careerHistory) && data.careerHistory.length === 1 ? [] : 
                    data.careerHistory.slice(1).map((e: any)=>
                        prisma.dataRiwayatKarir.create({
                            data: {
                                position: e.position,
                                levelPosition: e.levelPosition,
                                personnelArea: e.personnelArea,
                                personnelSubarea: e.personnelSubarea,
                                tanggalMulai: e.tanggalMulai,
                                tanggalBerakhir: e.tanggalBerakhir,
                                status: e.status,
                                idCareerHistory: e.idCareerHistory,
                                DataKaryawan: {
                                    connect: { nomorIndukKaryawan: session.user.nik }
                                }

                            },
                        })
                    )),
                ...(Array.isArray(data.orgIntHistory) && data.orgIntHistory.length !== 0 ? 
                    data.orgIntHistory.map((e: any) =>
                        prisma.dataRiwayatOrganisasiInternal.create({
                            data: {
                                idRiwayatOrganisasiInternal: e.idRiwayatOrganisasiInternal,
                                namaOrganisasi: e.namaOrganisasi,
                                namaPosisi: e.namaPosisi,
                                tahunMulai: e.tahunMulai,
                                tahunSelesai: e.tahunSelesai,
                                DataKaryawan: {
                                    connect: { nomorIndukKaryawan: session.user.nik }
                                }
                            },
                        })
                    )
                    : []),
                ...(Array.isArray(data.projectHistory) && data.projectHistory.length !== 0 ? 
                    data.projectHistory.map((e: any) =>
                        prisma.dataRiwayatProject.create({
                            data: {
                                idRiwayatProject: e.idRiwayatProject,
                                judulProject: e.judulProject,
                                namaPosisi: e.namaPosisi,
                                lamaKolaborasi: e.lamaKolaborasi,
                                shortDesc: e.shortDesc,
                                DataKaryawan: {
                                    connect: { nomorIndukKaryawan: session.user.nik }
                                }
                            },
                        })
                    )
                    : []),
                ...(Array.isArray(data.comiteeHistory) && data.comiteeHistory.length !== 0 ? 
                    data.comiteeHistory.map((e: any) =>
                        prisma.dataRiwayatKepanitiaan.create({
                            data: {
                                idRiwayatKepanitiaan: e.idRiwayatKepanitiaan,
                                namaAcara: e.namaAcara,
                                namaPosisi: e.namaPosisi,
                                tahunPelaksanaan: e.tahunPelaksanaan,
                                DataKaryawan: {
                                    connect: { nomorIndukKaryawan: session.user.nik }
                                }
                            },
                        })
                    )
                    : []),
                prisma.dataRiwayatGKM.create({
                    data: {
                        banyakKeikutsertaan: data.gkmHistory.banyakKeikutsertaan,
                        posisiTertinggi: data.gkmHistory.posisiTertinggi,
                        DataKaryawan: {
                            connect: { nomorIndukKaryawan: session.user.nik }
                        }
                    }
                }),
                prisma.dataMentorWanted.create({
                    data: {
                        namaMentor: data.mentorWanted.namaMentor,
                        posisiMentor: data.mentorWanted.posisiMentor,
                        cabangMentor: data.mentorWanted.cabangMentor,
                        DataKaryawan: {
                            connect: { nomorIndukKaryawan: session.user.nik }
                        }
                    }
                }),
                ...(Array.isArray(data.trainingWanted) && data.trainingWanted.length !== 0 ? 
                    data.trainingWanted.map((e: any) =>
                        prisma.dataTrainingWanted.create({
                            data: {
                                idTraining: e.idTraining,
                                topikTraining: e.topikTraining,
                                DataKaryawan: {
                                    connect: { nomorIndukKaryawan: session.user.nik }
                                }
                            },
                        })
                    )
                    : []),
                prisma.dataKaryawan.update({
                    where: {
                        nomorIndukKaryawan: session.user.nik
                    },
                    data: {
                        BestEmployee: data.bestEmployee,
                        formFilled: 1
                    }
                }),
                prisma.empCareerChoice.create({
                    data: {
                        careerDevWill: data.empCareerChoice.careerDevWill,
                        rotationWill: data.empCareerChoice.rotationWill,
                        crossDeptWill: data.empCareerChoice.crossDeptWill,
                        DataKaryawan: {
                            connect: { nomorIndukKaryawan: session.user.nik }
                        }
                    }
                }),
                prisma.reasons.create(
                    {
                        data: {
                            rotunwillReason: data.reasons.rotunwillReason,
                            DataKaryawan: {
                                connect: { nomorIndukKaryawan: session.user.nik }
                            }
                        }
                    }
                ),
                ...(data.careerOfMyChoice.positionShortTerm === null
                    ? [] : [
                        prisma.dataCareerPlan.create({
                        data: {
                            positionShortTerm: data.careerOfMyChoice.positionShortTerm,
                            positionLongTerm: data.careerOfMyChoice.positionLongTerm,
                            DataKaryawan: {
                                connect: { nomorIndukKaryawan: session.user.nik }
                            }
                        },
                        }),
                    ]
                    ),
            ]
        )

        return NextResponse.json(result, {status: 200});
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