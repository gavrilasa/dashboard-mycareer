import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";

export async function DELETE(req: NextRequest, {params}:{params: {idCP: string}}){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden", message: "Anda belum login atau bukan seorang HR" }, { status: 403 });
    }
    const {idCP} = await params
    if (!idCP) {
        return NextResponse.json({ error: "Bad Request", message: "ID Career Path tidak ditemukan" }, { status: 400 });
    }

    try {
        const result = await prisma.careerPath.delete({
            where: {
                idCP: idCP,
            } 
        })
        return NextResponse.json(
            { 
                result: result,
                message: "Career Path berhasil dihapus!" 
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    return NextResponse.json({
                    error: 'Duplikat Data',
                    message: `Kolom '${(error.meta?.target as string[]).join(', ')}' harus unik, namun nilai tersebut sudah ada di database.`,
                    }, { status: 409 });

                case 'P2003':
                    return NextResponse.json({
                    error: 'Referensi Tidak Valid',
                    message: `Data yang coba ditautkan (foreign key) tidak ditemukan. Periksa apakah ID atau relasi terkait benar.`,
                    }, { status: 400 });

                case 'P2000':
                    return NextResponse.json({
                    error: 'Input Terlalu Panjang',
                    message: `Nilai yang dikirim terlalu panjang untuk kolom '${error.meta?.column_name}'. Potong input atau periksa batas maksimal.`,
                    }, { status: 400 });

                case 'P2025':
                    return NextResponse.json({
                    error: 'Data Tidak Ditemukan',
                    message: `Data yang ingin diubah atau dihapus tidak ditemukan. Mungkin sudah dihapus atau ID-nya salah.`,
                    }, { status: 404 });

                case 'P2014':
                    return NextResponse.json({
                    error: 'Relasi Tidak Lengkap',
                    message: `Operasi gagal karena record yang berkaitan tidak ada. Pastikan data relasi dibuat terlebih dahulu.`,
                    }, { status: 400 });

                default:
                    return NextResponse.json({
                    error: `Prisma Error (${error.code})`,
                    message: error.message,
                    }, { status: 400 });
            }
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error('Unknown Prisma error:', error.message);
            return NextResponse.json({ error: `Unknown Prisma error`, message: "Terjadi error dari ORM Prisma" }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Internal Server Error", message: "Terjadi error pada database/server" }, { status: 500 });
        }
    }

}