import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";
import { questionnairesFE } from "@/types/datatype-questionnaire";

export async function GET(
	req: NextRequest,
	{ params }: { params: { nomorIndukKaryawan: string } }
) {
	const session = await auth();
	const { nomorIndukKaryawan } = await params;
	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Unauthorized", message: "Mohon login terlebih dahulu" },
			{ status: 401 }
		);
	}

	try {
		const pos = await prisma.dataKaryawan.findUnique({
			where: {
				nomorIndukKaryawan: nomorIndukKaryawan,
			},
			select: {
				position: true,
			},
		});
		const questionnaireResult = await prisma.$transaction(async (tx) => {
			const idResponses: Array<{ idResp: string; id_form: string }> =
				await tx.responses.findMany({
					where: {
						nomorIndukKaryawan: nomorIndukKaryawan,
					},
					select: {
						idResp: true,
						id_form: true,
					},
				});
			if (idResponses.length === 0) {
				return NextResponse.json(
					{
						error: "Data Tidak Ditemukan",
						message: `Data response tidak ditemukan. Karyawan mungkin belum mengisi questinnaire.`,
					},
					{ status: 404 }
				);
			}
			// array of null, array of object, or array of null and object
			const forms: Array<null> | Array<object> | Array<object | null> =
				await Promise.all(
					idResponses.map((e: { idResp: string; id_form: string }) =>
						tx.forms.findUnique({
							where: {
								idForm: e.id_form,
							},
							include: {
								AssessmentType: {
									where: {
										InvolvedPosition: {
											some: {
												idPosition: pos?.position,
											},
										},
									},
									include: {
										Questions: {},
									},
								},
							},
						})
					)
				);
			if (forms.every((e: object | null) => e === null)) {
				return NextResponse.json(
					{
						error: "Data Tidak Ditemukan",
						message: `Data forms tidak ditemukan. Mungkin sudah dihapus atau ID-nya salah.`,
					},
					{ status: 404 }
				);
			}
			// bakal jadi array of 'array of object'
			const answers: Array<
				Array<{
					idAnswer: string;
					idAssess: string;
					idQuestion: string;
					idResp: string;
					answer: number;
				}>
			> = await Promise.all(
				idResponses.map((e: { idResp: string; id_form: string }) =>
					tx.answers.findMany({
						where: {
							idResp: e.idResp,
						},
						select: {
							idAnswer: true,
							idAssess: true,
							idQuestion: true,
							idResp: true,
							answer: true,
						},
					})
				)
			);
			if (answers.every((e: any) => e.length === 0)) {
				return NextResponse.json(
					{
						error: "Data Tidak Ditemukan",
						message: `Data jawaban tidak ditemukan. Karyawan mungkin belum mengisi questinnaire.`,
					},
					{ status: 404 }
				);
			}

			const flatAnswers: Array<{
				idAnswer: string;
				idAssess: string;
				idQuestion: string;
				idResp: string;
				answer: number;
			}> = answers.flatMap(
				(
					e2: Array<{
						idAnswer: string;
						idAssess: string;
						idQuestion: string;
						idResp: string;
						answer: number;
					}>
				) => e2
			);

			return forms
				.filter((e: any) => e !== null)
				.map((form: any) => {
					return {
						IDForm: form.idForm,
						TitleForm: form.titleForm,
						DescForm: form.descForm,
						AssessmentType: form.AssessmentType.map((assessmen: any) => ({
							IDAssessment: assessmen.idAssessmentType,
							TitleAssessment: assessmen.titleAT,
							DescAssessment: assessmen.descAT,
							TypeAssessment: assessmen.typeAT,
							Ques: assessmen.Questions.map((q: any) => ({
								IDQue: q.idQuestion,
								TitleQue: q.titleQue,
								DescQue: q.Question,
								answer: flatAnswers.find(
									(e: any) =>
										e.idAssess === assessmen.idAssessmentType &&
										e.idQuestion === q.idQuestion
								)?.answer,
							})),
						})),
					};
				});
		});
		return NextResponse.json(questionnaireResult, { status: 200 });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2002":
					return NextResponse.json(
						{
							error: "Duplikat Data",
							message: `Kolom '${(error.meta?.target as string[]).join(
								", "
							)}' harus unik, namun nilai tersebut sudah ada di database.`,
						},
						{ status: 409 }
					);

				case "P2003":
					return NextResponse.json(
						{
							error: "Referensi Tidak Valid",
							message: `Data yang coba ditautkan (foreign key) tidak ditemukan. Periksa apakah ID atau relasi terkait benar.`,
						},
						{ status: 400 }
					);

				case "P2000":
					return NextResponse.json(
						{
							error: "Input Terlalu Panjang",
							message: `Nilai yang dikirim terlalu panjang untuk kolom '${error.meta?.column_name}'. Potong input atau periksa batas maksimal.`,
						},
						{ status: 400 }
					);

				case "P2025":
					return NextResponse.json(
						{
							error: "Data Tidak Ditemukan",
							message: `Data yang ingin diubah atau dihapus tidak ditemukan. Mungkin sudah dihapus atau ID-nya salah.`,
						},
						{ status: 404 }
					);

				case "P2014":
					return NextResponse.json(
						{
							error: "Relasi Tidak Lengkap",
							message: `Operasi gagal karena record yang berkaitan tidak ada. Pastikan data relasi dibuat terlebih dahulu.`,
						},
						{ status: 400 }
					);

				default:
					return NextResponse.json(
						{
							error: `Prisma Error (${error.code})`,
							message: error.message,
						},
						{ status: 400 }
					);
			}
		} else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			console.error("Unknown Prisma error:", error.message);
			return NextResponse.json(
				{
					error: `Unknown Prisma error`,
					message: "Terjadi error dari ORM Prisma",
				},
				{ status: 500 }
			);
		} else {
			return NextResponse.json(
				{
					error: "Internal Server Error",
					message: "Terjadi error pada database/server",
				},
				{ status: 500 }
			);
		}
	}
}
