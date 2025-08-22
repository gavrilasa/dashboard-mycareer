// prisma/seed-recommendations.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const recommendationsData: {
	competency: string;
	subCompetency: string;
	recommendation: string;
}[] = [
	{
		competency: "Production Process Handling",
		subCompetency: "Parameter Proses",
		recommendation: "Parameter Proses",
	},
	{
		competency: "Production Process Handling",
		subCompetency: "Standar Output",
		recommendation: "Standar Output",
	},
	{
		competency: "Production Process Handling",
		subCompetency: "Laporan Produksi",
		recommendation: "Laporan Produksi",
	},
	{
		competency: "Production Process Handling",
		subCompetency: "Performance Manufacturing",
		recommendation: "Performance Manufacturing",
	},
	{
		competency: "Production Process Handling",
		subCompetency: "Strategi Produksi",
		recommendation: "Strategi Produksi",
	},
	{
		competency: "Production Machine Mastery (Machine Handling)",
		subCompetency: "Spesifikasi Mesin Produksi",
		recommendation: "Spesifikasi Mesin Produksi",
	},
	{
		competency: "Production Machine Mastery (Machine Handling)",
		subCompetency: "Kapasitas Mesin Produksi",
		recommendation: "Kapasitas Mesin Produksi",
	},
	{
		competency: "Production Machine Mastery (Machine Handling)",
		subCompetency: "Operasional Mesin Produksi",
		recommendation: "Operasional Mesin Produksi",
	},
	{
		competency: "Production Machine Mastery (Machine Handling)",
		subCompetency: "Maintenance Mesin Produksi",
		recommendation: "Maintenance Mesin Produksi",
	},
	{
		competency: "Production Machine Mastery (Machine Handling)",
		subCompetency: "Pengelolaan Mesin Produksi",
		recommendation: "Pengelolaan Mesin Produksi",
	},
	{
		competency: "Basic Preventive Maintenance Machine Skill",
		subCompetency: "Sparepart Mesin Produksi",
		recommendation: "Sparepart Mesin Produksi",
	},
	{
		competency: "Basic Preventive Maintenance Machine Skill",
		subCompetency: "Mapping Mesin Produksi",
		recommendation: "Mapping Mesin Produksi",
	},
	{
		competency: "Basic Preventive Maintenance Machine Skill",
		subCompetency: "Sanitasi Mesin Produksi",
		recommendation: "Sanitasi Mesin Produksi",
	},
	{
		competency: "Basic Preventive Maintenance Machine Skill",
		subCompetency: "Preventive Maintenance",
		recommendation: "Preventive Maintenance",
	},
	{
		competency: "Man Power Handling",
		subCompetency: "Standar Manpower",
		recommendation: "Standar Manpower",
	},
	{
		competency: "Man Power Handling",
		subCompetency: "Pengelolaan Manpower",
		recommendation: "Pengelolaan Manpower",
	},
	{
		competency: "Man Power Handling",
		subCompetency: "Law Enforcement",
		recommendation: "Law Enforcement",
	},
	{
		competency: "Man Power Handling",
		subCompetency: "Evaluasi Kinerja",
		recommendation: "Evaluasi Kinerja",
	},
	{
		competency: "Man Power Handling",
		subCompetency: "Pengelolaan OT",
		recommendation: "Pengelolaan OT",
	},
	{
		competency: "Raw Material Handling",
		subCompetency: "Proses RM dan FG",
		recommendation: "Proses RM dan FG",
	},
	{
		competency: "Raw Material Handling",
		subCompetency: "Waste Management",
		recommendation: "Waste Management",
	},
	{
		competency: "Raw Material Handling",
		subCompetency: "Spesifikasi RM",
		recommendation: "Spesifikasi RM",
	},
	{
		competency: "Raw Material Handling",
		subCompetency: "Pengelolaan RM",
		recommendation: "Pengelolaan RM",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Prinsip Kerja SILO",
		recommendation: "Prinsip Kerja SILO",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Prinsip Kerja Mixer",
		recommendation: "Prinsip Kerja Mixer",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Prinsip Kerja Press",
		recommendation: "Prinsip Kerja Press",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Prinsip Kerja Steam",
		recommendation: "Prinsip Kerja Steam",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Prinsip Fryer dan Heat",
		recommendation: "Prinsip Fryer dan Heat",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Prinsip Kerja Packing",
		recommendation: "Prinsip Kerja Packing",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Pemahaman Manual Book Mesin",
		recommendation: "Pemahaman Manual Book Mesin",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Sparepart Management",
		recommendation: "Sparepart Management",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Maintenance Mesin",
		recommendation: "Maintenance Mesin",
	},
	{
		competency: "Technical Machine Mastery",
		subCompetency: "Produktivitas Kinerja Mesin",
		recommendation: "Produktivitas Kinerja Mesin",
	},
	{
		competency: "Technical Preventive Maintenance Machine Skill",
		subCompetency: "Pengelolaan Preventive Maintenance",
		recommendation: "Pengelolaan Preventive Maintenance",
	},
	{
		competency: "Technical Preventive Maintenance Machine Skill",
		subCompetency: "Evaluasi Preventive Maintenance",
		recommendation: "Evaluasi Preventive Maintenance",
	},
	{
		competency: "Machine Fabrication Mastery",
		subCompetency: "Penggunaan Alat Las",
		recommendation: "Penggunaan Alat Las",
	},
	{
		competency: "Machine Fabrication Mastery",
		subCompetency: "Penggunaan Alat Bubut",
		recommendation: "Penggunaan Alat Bubut",
	},
	{
		competency: "Machine Fabrication Mastery",
		subCompetency: "Penggunaan Alat Workshop Lainnya",
		recommendation: "Penggunaan Alat Workshop Lainnya",
	},
	{
		competency: "Machine Fabrication Mastery",
		subCompetency: "Pemahaman Spare Part Mesin",
		recommendation: "Pemahaman Spare Part Mesin",
	},
	{
		competency: "Machine Fabrication Mastery",
		subCompetency: "Gambar Mesin",
		recommendation: "Gambar Mesin",
	},
	{
		competency: "Machine Fabrication Mastery",
		subCompetency: "Pengembangan Mesin",
		recommendation: "Pengembangan Mesin",
	},
	{
		competency: "Utility Management",
		subCompetency: "Pengelolaan Boiler",
		recommendation: "Pengelolaan Boiler",
	},
	{
		competency: "Utility Management",
		subCompetency: "Pengelolaan Compressor",
		recommendation: "Pengelolaan Compressor",
	},
	{
		competency: "Utility Management",
		subCompetency: "Pengelolaan Genset",
		recommendation: "Pengelolaan Genset",
	},
	{
		competency: "Utility Management",
		subCompetency: "Kelistrikan",
		recommendation: "Kelistrikan",
	},
	{
		competency: "Utility Management",
		subCompetency: "Mapping Utility",
		recommendation: "Mapping Utility",
	},
	{
		competency: "Quality Control Process Mastery",
		subCompetency: "Parameter Kontrol Produksi",
		recommendation: "Parameter Kontrol Produksi",
	},
	{
		competency: "Quality Control Process Mastery",
		subCompetency: "Sampling Proses",
		recommendation: "Sampling Proses",
	},
	{
		competency: "Quality Control Process Mastery",
		subCompetency: "Report QC",
		recommendation: "Report QC",
	},
	{
		competency: "Quality Control Process Mastery",
		subCompetency: "Pengolahan Pangan",
		recommendation: "Pengolahan Pangan",
	},
	{
		competency: "Quality Control Process Mastery",
		subCompetency: "Pengelolaan Penyimpangan Produk",
		recommendation: "Pengelolaan Penyimpangan Produk",
	},
	{
		competency: "Incoming QC Mastering",
		subCompetency: "Pemahaman Sampling RM",
		recommendation: "Pemahaman Sampling RM",
	},
	{
		competency: "Incoming QC Mastering",
		subCompetency: "Laporan Incoming QC",
		recommendation: "Laporan Incoming QC",
	},
	{
		competency: "Laboratorium Analysis Mastery",
		subCompetency: "Pelaksanaan Uji Lab",
		recommendation: "Pelaksanaan Uji Lab",
	},
	{
		competency: "Laboratorium Analysis Mastery",
		subCompetency: "Pengelolaan GLP",
		recommendation: "Pengelolaan GLP",
	},
	{
		competency: "Laboratorium Analysis Mastery",
		subCompetency: "Pemahaman tentang Lab",
		recommendation: "Pemahaman tentang Lab",
	},
	{
		competency: "Outgoing QC Mastering",
		subCompetency: "Pemahaman Sampling FG",
		recommendation: "Pemahaman Sampling FG",
	},
	{
		competency: "Outgoing QC Mastering",
		subCompetency: "Audit Pasar",
		recommendation: "Audit Pasar",
	},
	{
		competency: "Outgoing QC Mastering",
		subCompetency: "Laporan Outgoing",
		recommendation: "Laporan Outgoing",
	},
	{
		competency: "Production Planning",
		subCompetency: "Pemahaman Mesin Produksi",
		recommendation: "Pemahaman Mesin Produksi",
	},
	{
		competency: "Production Planning",
		subCompetency: "Pemahaman Proses Produksi",
		recommendation: "Pemahaman Proses Produksi",
	},
	{
		competency: "Production Planning",
		subCompetency: "Scheduling",
		recommendation: "Scheduling",
	},
	{
		competency: "Production Planning",
		subCompetency: "Forecasting",
		recommendation: "Forecasting",
	},
	{
		competency: "Production Planning",
		subCompetency: "Pengetahuan Produk",
		recommendation: "Pengetahuan Produk",
	},
	{
		competency: "RM Procurement Mastery",
		subCompetency: "Pengelolaan Buffer Stock",
		recommendation: "Pengelolaan Buffer Stock",
	},
	{
		competency: "RM Procurement Mastery",
		subCompetency: "Pengelolaan RM",
		recommendation: "Pengelolaan RM",
	},
	{
		competency: "RM Procurement Mastery",
		subCompetency: "Pengelolaan Waste RM",
		recommendation: "Pengelolaan Waste RM",
	},
	{
		competency: "Inventory Control",
		subCompetency: "Monitoring RM dan FG",
		recommendation: "Monitoring RM dan FG",
	},
	{
		competency: "Inventory Control",
		subCompetency: "Analisa umur FG",
		recommendation: "Analisa umur FG",
	},
	{
		competency: "Inventory Control",
		subCompetency: "Pengelolaan ITO",
		recommendation: "Pengelolaan ITO",
	},
	{
		competency: "Suply Chain Management",
		subCompetency: "Pemahaman STT dan STD",
		recommendation: "Pemahaman STT dan STD",
	},
	{
		competency: "Suply Chain Management",
		subCompetency: "Pengelolaan Stock FG",
		recommendation: "Pengelolaan Stock FG",
	},
	{
		competency: "Manufacturing Performance Report",
		subCompetency: "Pengelolaan Manufacturing Performa",
		recommendation: "Pengelolaan Manufacturing Performa",
	},
	{
		competency: "Manufacturing Performance Report",
		subCompetency: "ITO dan SAP",
		recommendation: "ITO dan SAP",
	},
	{
		competency: "Warehouse Management",
		subCompetency: "Pengelolaan RM/FG/Sparepart",
		recommendation: "Pengelolaan RM/FG/Sparepart",
	},
	{
		competency: "Warehouse Management",
		subCompetency: "Material Handling",
		recommendation: "Material Handling",
	},
	{
		competency: "Warehouse Management",
		subCompetency: "Manajemen Pergudangan",
		recommendation: "Manajemen Pergudangan",
	},
	{
		competency: "Warehouse Management",
		subCompetency: "Implementasi 5 S",
		recommendation: "Implementasi 5 S",
	},
	{
		competency: "RM Inventory Management",
		subCompetency: "Pengelolaan RM",
		recommendation: "Pengelolaan RM",
	},
	{
		competency: "RM Inventory Management",
		subCompetency: "Evaluasi RM",
		recommendation: "Evaluasi RM",
	},
	{
		competency: "RM Inventory Management",
		subCompetency: "pengelolaan Ketidaksesuaian RM",
		recommendation: "pengelolaan Ketidaksesuaian RM",
	},
	{
		competency: "RM Inventory Management",
		subCompetency: "Stock Opname",
		recommendation: "Stock Opname",
	},
	{
		competency: "FG Inventory Management",
		subCompetency: "Pengelolaan FG",
		recommendation: "Pengelolaan FG",
	},
	{
		competency: "FG Inventory Management",
		subCompetency: "Evaluasi FG",
		recommendation: "Evaluasi FG",
	},
	{
		competency: "FG Inventory Management",
		subCompetency: "pengelolaan Ketidaksesuaian FG",
		recommendation: "pengelolaan Ketidaksesuaian FG",
	},
	{
		competency: "FG Inventory Management",
		subCompetency: "Pengelolaan Aktivitas Loading",
		recommendation: "Pengelolaan Aktivitas Loading",
	},
	{
		competency: "Capacity planning",
		subCompetency: "Kapasitas Gudang",
		recommendation: "Kapasitas Gudang",
	},
	{
		competency: "Capacity planning",
		subCompetency: "Desain Aktivitas Pengeluaran Barang",
		recommendation: "Desain Aktivitas Pengeluaran Barang",
	},
	{
		competency: "Physical Stock Management",
		subCompetency: "Fifo Proses",
		recommendation: "Fifo Proses",
	},
	{
		competency: "Physical Stock Management",
		subCompetency: "Pengelolaan Palet",
		recommendation: "Pengelolaan Palet",
	},
	{
		competency: "Industrial Truck Mastery",
		subCompetency: "Pemahaman Alat Angkut",
		recommendation: "Pemahaman Alat Angkut",
	},
	{
		competency: "Industrial Truck Mastery",
		subCompetency: "Operasional Fokrlift",
		recommendation: "Operasional Fokrlift",
	},
	{
		competency: "Industrial Truck Mastery",
		subCompetency: "Operasional Skidloader",
		recommendation: "Operasional Skidloader",
	},
	{
		competency: "Industrial Truck Mastery",
		subCompetency: "Maintenance Alat Angkut",
		recommendation: "Maintenance Alat Angkut",
	},
	{
		competency: "Industrial Truck Mastery",
		subCompetency: "Pemahaman Alat Angkut",
		recommendation: "Pemahaman Alat Angkut",
	},
	{
		competency: "Administrastion Mastering",
		subCompetency: "Filing Dokument",
		recommendation: "Filing Dokument",
	},
	{
		competency: "Administrastion Mastering",
		subCompetency: "MS Office",
		recommendation: "Pengoperasian MS Office",
	},
	{
		competency: "Administrastion Mastering",
		subCompetency: "Prosedur Klaim",
		recommendation: "Prosedur Klaim",
	},
	{
		competency: "Administrastion Mastering",
		subCompetency: "Koordinasi",
		recommendation: "Koordinasi",
	},
	{
		competency: "Database Management",
		subCompetency: "Database Dokumen",
		recommendation: "Database Dokumen",
	},
	{
		competency: "Database Management",
		subCompetency: "Alat Analisa Data",
		recommendation: "Alat Analisa Data",
	},
	{
		competency: "Database Management",
		subCompetency: "Pembuatan Laporan",
		recommendation: "Pembuatan Laporan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pemahaman Sistem Manajemen",
		recommendation: "Pemahaman Sistem Manajemen",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Menjadi Trainer SM",
		recommendation: "Menjadi Trainer SM",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pembuatan Aturan",
		recommendation: "Pembuatan Aturan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pelaksanaan Audit",
		recommendation: "Pelaksanaan Audit",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Sertifikasi SM",
		recommendation: "Sertifikasi SM",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pendampingan",
		recommendation: "Pendampingan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Strategi Pelaksanaan SM",
		recommendation: "Strategi Pelaksanaan SM",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pemahaman Alur Proses Kerja",
		recommendation: "Pemahaman Alur Proses Kerja",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pembuatan SOP Proses Kerja",
		recommendation: "Pembuatan SOP Proses Kerja",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Perbaikan Alur Proses Kerja",
		recommendation: "Perbaikan Alur Proses Kerja",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "PKB",
		recommendation: "PKB",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Standar MP",
		recommendation: "Standar MP",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "KPI",
		recommendation: "Pembuatan KPI",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Tim",
		recommendation: "Pengembangan Tim",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Organisasi",
		recommendation: "Pengembangan Organisasi",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengadaan Tenaga Kerja",
		recommendation: "Pengadaan Tenaga Kerja",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Mekanisme Comben",
		recommendation: "Mekanisme Comben",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP dalam fungsinya",
		recommendation: "SAP dalam fungsinya",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP luar fungsinya",
		recommendation: "SAP luar fungsinya",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "BluePrint Sistem",
		recommendation: "Pembuatan BluePrint Sistem",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Evaluasi SAP",
		recommendation: "Evaluasi SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Sistem Lain",
		recommendation: "Pengelolaan Sistem Lainnya",
	},
	{
		competency: "Financial Management",
		subCompetency: "Capex/Eapex",
		recommendation: "Pembuatan Capex/Eapex",
	},
	{
		competency: "Financial Management",
		subCompetency: "Laporan Keuangan",
		recommendation: "Pembuatan Laporan Keuangan",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost Benefit",
		recommendation: "Pembuatan Cost Benefit",
	},
	{
		competency: "Financial Management",
		subCompetency: "Financial",
		recommendation: "Pemahaman tentang Financial",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost",
		recommendation: "Pemahaman tentang Cost",
	},
	{
		competency: "Recruitment Management",
		subCompetency: "PTK Management",
		recommendation: "PTK Management",
	},
	{
		competency: "Recruitment Management",
		subCompetency: "Sourcing Kandidat",
		recommendation: "Resourcing Strategy",
	},
	{
		competency: "Recruitment Management",
		subCompetency: "Recruitment Strategi",
		recommendation: "Resourcing Strategy",
	},
	{
		competency: "Recruitment Management",
		subCompetency: "Recruitment Proses",
		recommendation: "Recruitment Process Evaluation",
	},
	{
		competency: "Recruitment Management",
		subCompetency: "Recruitment Metode",
		recommendation: "Recruitment Metode",
	},
	{
		competency: "Recruitment Management",
		subCompetency: "Orientasi Karyawan",
		recommendation: "Orientasi Karyawan Baru",
	},
	{
		competency: "Recruitment Management",
		subCompetency: "Pengelolaan Vendor Recruitment",
		recommendation: "Pengelolaan Vendor Recruitment",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "TNA Management",
		recommendation: "TNA Management",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "SOP Training",
		recommendation: "SOP Training",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "Penyusunan Materi",
		recommendation: "Penyusunan Materi Training",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "Trainer Internal",
		recommendation: "Training of trainer",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "Evaluasi Training",
		recommendation: "Evaluation Training Methode",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "Training Proses",
		recommendation: "Training Process",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "Pengelolaan Vendor Training",
		recommendation: "Pengelolaan Vendor Training",
	},
	{
		competency: "Training and Development Management",
		subCompetency: "Training Sistem",
		recommendation: "Pengembangan Sistem Pengelolaan Training",
	},
	{
		competency: "Manajemen Sarana Hubungan Industrial",
		subCompetency: "Mapping SHI",
		recommendation: "Pemetaan Sarana Hubungan Industrial",
	},
	{
		competency: "Manajemen Sarana Hubungan Industrial",
		subCompetency: "Pengelolaan SHI",
		recommendation: "Pengelolaan Sarana Hubungan Industrial",
	},
	{
		competency: "Manajemen Sarana Hubungan Industrial",
		subCompetency: "Pembinaan SP",
		recommendation: "Pembinaan Serikat Pekerja",
	},
	{
		competency: "Manajemen Sarana Hubungan Industrial",
		subCompetency: "Pengelolaan Aktivitas HI",
		recommendation: "Pengelolaan Aktivitas HI",
	},
	{
		competency: "Manajemen Sarana Hubungan Industrial",
		subCompetency: "Law Enforcement Karyawan",
		recommendation: "Law Enforcement Karyawan",
	},
	{
		competency: "Policy & Legal Opinion",
		subCompetency: "Legal Review",
		recommendation: "Legal Review Mekanism",
	},
	{
		competency: "Policy & Legal Opinion",
		subCompetency: "Update Legal",
		recommendation: "Legal Update Process",
	},
	{
		competency: "Policy & Legal Opinion",
		subCompetency: "Penyusunan Internal Policy",
		recommendation: "Pembuatan Kebijakan Internal",
	},
	{
		competency: "Policy & Legal Opinion",
		subCompetency: "Pengelolaan Perijinan",
		recommendation: "Proses Perijinan",
	},
	{
		competency: "Manajemen PPHI",
		subCompetency: "Pengelolaan Bipartit",
		recommendation: "Pengelolaan Bipartit",
	},
	{
		competency: "Manajemen PPHI",
		subCompetency: "Pengelolaan Konflik",
		recommendation: "Pengelolaan Konflik",
	},
	{
		competency: "Manajemen PPHI",
		subCompetency: "PHK Proses",
		recommendation: "PHK Process Mekanism",
	},
	{
		competency: "Manajemen PPHI",
		subCompetency: "PPHI Review",
		recommendation: "PPHI Review",
	},
	{
		competency: "Pengelolaan LKS Bipartit",
		subCompetency: "LKS Bipartit",
		recommendation: "LKS Bipartit",
	},
	{
		competency: "Pengelolaan LKS Bipartit",
		subCompetency: "Pengelolaan Isu",
		recommendation: "Pengelolaan Isu",
	},
	{
		competency: "Pengelolaan LKS Bipartit",
		subCompetency: "Harmonisasi Relasi",
		recommendation: "Harmonisasi Relasi",
	},
	{
		competency: "Organization Development",
		subCompetency: "Spesifikasi Jabatan",
		recommendation: "Spesifikasi Jabatan",
	},
	{
		competency: "Organization Development",
		subCompetency: "Pengembangan Kompetensi",
		recommendation: "Pengembangan Kompetensi",
	},
	{
		competency: "Organization Development",
		subCompetency: "Evaluasi Jabatan",
		recommendation: "Evaluasi Jabatan",
	},
	{
		competency: "Organization Development",
		subCompetency: "Design Organisasi",
		recommendation: "Design Organisasi",
	},
	{
		competency: "Organization Development",
		subCompetency: "Strategi Pengembangan Organisasi",
		recommendation: "Strategi Pengembangan Organisasi",
	},
	{
		competency: "Talent Management",
		subCompetency: "Sourcing Talent",
		recommendation: "Sourcing & Profiling Talent",
	},
	{
		competency: "Talent Management",
		subCompetency: "Profiling Talent",
		recommendation: "Sourcing & Profiling Talent",
	},
	{
		competency: "Talent Management",
		subCompetency: "SOP Sistem Manajement Talent",
		recommendation: "SOP Sistem Manajement Talent",
	},
	{
		competency: "Talent Management",
		subCompetency: "Pengelolaan IDP",
		recommendation: "Pengelolaan IDP",
	},
	{
		competency: "Talent Management",
		subCompetency: "Pengelolaan Talent",
		recommendation: "Pengelolaan Talent",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Payroll Proses",
		recommendation: "Payroll Proses",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Klaim Benefit Proses",
		recommendation: "Klaim Benefit Proses",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Pengelolaan Absensi",
		recommendation: "Pengelolaan Produktifitas",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Pengelolaan OT",
		recommendation: "Pengelolaan Produktifitas",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Pengelolaan Insentif",
		recommendation: "Pengelolaan Produktifitas",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Filing DataBase",
		recommendation: "Filing DataBase",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Pengupahan",
		recommendation: "Payroll Proses",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Pengelolaan Comben",
		recommendation: "Pengelolaan Comben",
	},
	{
		competency: "Manajemen ComBen",
		subCompetency: "Job Evaluation",
		recommendation: "Job Evaluation",
	},
	{
		competency: "Man Power Planning dan Productivity",
		subCompetency: "Manpower Planning Proses",
		recommendation: "Manpower Planning",
	},
	{
		competency: "Man Power Planning dan Productivity",
		subCompetency: "Pengelolaan Standar Manpower",
		recommendation: "Pengelolaan Standar Manpower",
	},
	{
		competency: "Man Power Planning dan Productivity",
		subCompetency: "Manpower Cost",
		recommendation: "Manpower Cost",
	},
	{
		competency: "Pengelolaan Kinerja",
		subCompetency: "Pengelolaan KPI",
		recommendation: "Pengelolaan KPI",
	},
	{
		competency: "Pengelolaan Kinerja",
		subCompetency: "Pengelolaan Insentif PMS",
		recommendation: "Pengelolaan Insentif PMS",
	},
	{
		competency: "Pengelolaan Kinerja",
		subCompetency: "Performance Management",
		recommendation: "Performance Management",
	},
	{
		competency: "External & Public Relation",
		subCompetency: "Sosial Mapping",
		recommendation: "Sosial Mapping",
	},
	{
		competency: "External & Public Relation",
		subCompetency: "Menjalin Relasi Eksternal",
		recommendation: "Menjalin Relasi Eksternal",
	},
	{
		competency: "External & Public Relation",
		subCompetency: "Isu Eksternal",
		recommendation: "Sosial Mapping",
	},
	{
		competency: "External & Public Relation",
		subCompetency: "Factory Visit",
		recommendation: "Factory Visit",
	},
	{
		competency: "External & Public Relation",
		subCompetency: "Ambasador",
		recommendation: "Menjalin Relasi Eksternal",
	},
	{
		competency: "External & Public Relation",
		subCompetency: "Jurnalistik",
		recommendation: "Jurnalistik",
	},
	{
		competency: "Handling Customer Complain",
		subCompetency: "Penyelesain Keluhan Pelanggan",
		recommendation: "Strategi Penyelesaian Komplain",
	},
	{
		competency: "Handling Customer Complain",
		subCompetency: "Strategi Penyelesaian Komplain",
		recommendation: "Strategi Penyelesaian Komplain",
	},
	{
		competency: "Handling Customer Complain",
		subCompetency: "Survey Kepuasan Pelanggan",
		recommendation: "Survey Kepuasan Pelanggan",
	},
	{
		competency: "Asset/Facility Management",
		subCompetency: "Mapping Aset Perusahaan",
		recommendation: "Pengelolaan Aset",
	},
	{
		competency: "Asset/Facility Management",
		subCompetency: "Maintenance Aset",
		recommendation: "Pengelolaan Aset",
	},
	{
		competency: "Asset/Facility Management",
		subCompetency: "WWT",
		recommendation: "Pengelolaan WWT",
	},
	{
		competency: "Asset/Facility Management",
		subCompetency: "Pengelolaan Kantin",
		recommendation: "Pengelolaan Kantin",
	},
	{
		competency: "Asset/Facility Management",
		subCompetency: "Pengelolaan Aset",
		recommendation: "Pengelolaan Aset",
	},
	{
		competency: "Asset/Facility Management",
		subCompetency: "Aktivitas Pelayanan Karyawan",
		recommendation: "Aktivitas Pelayanan Karyawan",
	},
	{
		competency: "Asset/Facility Management",
		subCompetency: "Komputer Skill",
		recommendation: "Komputer Skill",
	},
	{
		competency: "Security Management",
		subCompetency: "Manajemen Keamanan",
		recommendation: "Manajemen Keamanan",
	},
	{
		competency: "Security Management",
		subCompetency: "Membangun Relasi dengan Eksternal",
		recommendation: "Membangun Relasi dengan Eksternal",
	},
	{
		competency: "Security Management",
		subCompetency: "Patroli",
		recommendation: "Patroli",
	},
	{
		competency: "Security Management",
		subCompetency: "SMK 3",
		recommendation: "Penerapan SMK 3",
	},
	{
		competency: "Security Management",
		subCompetency: "Law Enforcement Keamanan",
		recommendation: "Law Enforcement Keamanan",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Pemahaman Klausul SMK 3",
		recommendation: "Pemahaman Klausul SMK 3",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Pemahaman Klausul SML",
		recommendation: "Pemahaman Klausul SML",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Pengelolaan IBPR",
		recommendation: "Pengelolaan IBPR",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Pengelolaan Safety Permit",
		recommendation: "Pengelolaan Safety Permit",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Investigasi Kecelakaan Kerja",
		recommendation: "Investigasi Kecelakaan Kerja",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Membina Relasi",
		recommendation: "Membina Relasi dengan Eksternal",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Pengelolaan K3L",
		recommendation: "Pengelolaan K3L",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "DRKPL",
		recommendation: "Pembuatan DRKPL",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "UKL UPL",
		recommendation: "Pembuatan UKL UPL",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Pengelolaan LB3",
		recommendation: "Pengelolaan LB3",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Uji Lingkungan",
		recommendation: "Parameter Uji Lingkungan",
	},
	{
		competency: "Safety, Health, Environment Management",
		subCompetency: "Law Enforcement K3L",
		recommendation: "Law Enforcement K3L",
	},
	{
		competency: "Manajemen Energi",
		subCompetency: "Pemahaman Klausul SME",
		recommendation: "Pemahaman Klausul SME",
	},
	{
		competency: "Manajemen Energi",
		subCompetency: "Internal Audit",
		recommendation: "Internal Audit",
	},
	{
		competency: "Manajemen Energi",
		subCompetency: "Update Peraturan",
		recommendation: "Update Peraturan",
	},
	{
		competency: "Manajemen Energi",
		subCompetency: "POME System",
		recommendation: "POME System",
	},
	{
		competency: "Manajemen Energi",
		subCompetency: "Pengelolaan SME",
		recommendation: "Pengelolaan SME",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Filing Dokument",
		recommendation: "Filing Dokument",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "MS Office",
		recommendation: "Pengoperasian MS Office",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Prosedur Klaim",
		recommendation: "Prosedur Klaim",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Koordinasi",
		recommendation: "Koordinasi",
	},
	{
		competency: "Database Management",
		subCompetency: "Database Dokumen",
		recommendation: "Membuat Database Dokumen",
	},
	{
		competency: "Database Management",
		subCompetency: "Alat Analisa Data",
		recommendation: "Alat Analisa Data",
	},
	{
		competency: "Database Management",
		subCompetency: "Pembuatan Laporan",
		recommendation: "Pembuatan Laporan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pemahaman Sistem Manajemen",
		recommendation: "Pemahaman Sistem Manajemen",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Menjadi Trainer SM",
		recommendation: "Training of Trainer SM",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pembuatan Aturan",
		recommendation: "Pembuatan Aturan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pelaksanaan Audit",
		recommendation: "Pelaksanaan Audit",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Sertifikasi SM",
		recommendation: "Sertifikasi SM",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pendampingan",
		recommendation: "Pendampingan SM",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Strategi Pelaksanaan SM",
		recommendation: "Strategi Pelaksanaan SM",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pemahaman Alur Proses Kerja",
		recommendation: "Pemahaman Alur Proses Kerja",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pembuatan SOP Proses Kerja",
		recommendation: "Pembuatan SOP Proses Kerja",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Perbaikan Alur Proses Kerja",
		recommendation: "Perbaikan Alur Proses Kerja",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "PKB",
		recommendation: "Pemahaman PKB",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Standar MP",
		recommendation: "Standar ManPower",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "KPI",
		recommendation: "Pembuatan KPI",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Tim",
		recommendation: "Pengembangan Tim",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Organisasi",
		recommendation: "Pengembangan Organisasi",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengadaan Tenaga Kerja",
		recommendation: "Pengadaan Tenaga Kerja",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Mekanisme Comben",
		recommendation: "Mekanisme Comben",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP dalam fungsinya",
		recommendation: "Pengoperasian SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP luar fungsinya",
		recommendation: "Pengoperasian SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "BluePrint Sistem",
		recommendation: "Pembuatan BluePrint Sistem",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Evaluasi SAP",
		recommendation: "Evaluasi SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Sistem Lain",
		recommendation: "Pengoperasian SAP",
	},
	{
		competency: "Financial Management",
		subCompetency: "Capex/Eapex",
		recommendation: "Pembuatan Capex/Eapex",
	},
	{
		competency: "Financial Management",
		subCompetency: "Laporan Keuangan",
		recommendation: "Pembuatan Laporan Keuangan",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost Benefit",
		recommendation: "Pembuatan Cost Benefit",
	},
	{
		competency: "Financial Management",
		subCompetency: "Financial",
		recommendation: "Pemahaman tentang Financial",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost",
		recommendation: "Pemahaman tentang Cost",
	},
	{
		competency: "Budgeting Mastery",
		subCompetency: "Laporan Biaya Keuangan",
		recommendation: "Pembuatan Laporan Biaya Keuangan",
	},
	{
		competency: "Budgeting Mastery",
		subCompetency: "Penyusunan Budgeting",
		recommendation: "Penyusunan Budgeting",
	},
	{
		competency: "Budgeting Mastery",
		subCompetency: "Bisnis Proses All Departemen",
		recommendation: "Bisnis Proses Knowledge",
	},
	{
		competency: "Budgeting Mastery",
		subCompetency: "Pengelolaan Budgeting",
		recommendation: "Pengelolaan Budgeting",
	},
	{
		competency: "Taxation Mastery",
		subCompetency: "Pemahaman Pajak",
		recommendation: "Peraturan Perpajakan",
	},
	{
		competency: "Taxation Mastery",
		subCompetency: "Rekonsiliasi Pajak",
		recommendation: "Pembuatan Rekonsiliasi Pajak",
	},
	{
		competency: "Taxation Mastery",
		subCompetency: "Laporan Pajak",
		recommendation: "Pembuatan Laporan Pajak",
	},
	{
		competency: "Taxation Mastery",
		subCompetency: "Pemecahan Masalah Perpajakan",
		recommendation: "Pemecahan Masalah Perpajakan",
	},
	{
		competency: "Taxation Mastery",
		subCompetency: "Sertifikasi Perpajakan",
		recommendation: "Sertifikasi Perpajakan",
	},
	{
		competency: "Financial Report Mastery",
		subCompetency: "Pembuatan Laporan Keuangan",
		recommendation: "Pembuatan Laporan Keuangan",
	},
	{
		competency: "Financial Report Mastery",
		subCompetency: "Analisa Laporan Keuangan",
		recommendation: "Analisa Laporan Keuangan",
	},
	{
		competency: "Cost Accounting Mastery",
		subCompetency: "Komponen Biaya Produksi",
		recommendation: "Komponen Biaya Produksi",
	},
	{
		competency: "Cost Accounting Mastery",
		subCompetency: "Standar Manpower",
		recommendation: "Pengenalan Standar Manpower",
	},
	{
		competency: "Cost Accounting Mastery",
		subCompetency: "Perhitungan Costing PE",
		recommendation: "Perhitungan Costing PE",
	},
	{
		competency: "Cost Accounting Mastery",
		subCompetency: "Stock Opname",
		recommendation: "Mekanisme Stock Opname",
	},
	{
		competency: "Cost Accounting Mastery",
		subCompetency: "Analisa Proses Produksi",
		recommendation: "Pengetahuan Tentang Proses Produksi",
	},
	{
		competency: "General Accounting Mastery",
		subCompetency: "Proses Pembelian RM dan Non RM",
		recommendation: "Proses Pembelian RM dan Non RM",
	},
	{
		competency: "General Accounting Mastery",
		subCompetency: "Pengelolaan Operasional Expense",
		recommendation: "Pengelolaan Operasional Expense",
	},
	{
		competency: "General Accounting Mastery",
		subCompetency: "Pengendalian Resiko",
		recommendation: "Pengendalian Resiko",
	},
	{
		competency: "General Accounting Mastery",
		subCompetency: "Proses Pembayaran atau Klaim",
		recommendation: "Proses Pembayaran atau Klaim",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Filing Dokument",
		recommendation: "Filing Dokument",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "MS Office",
		recommendation: "Pengoperasian MS Office",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Prosedur Klaim",
		recommendation: "Prosedur Klaim",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Koordinasi",
		recommendation: "Koordinasi",
	},
	{
		competency: "Database Management",
		subCompetency: "Database Dokumen",
		recommendation: "Database Dokumen",
	},
	{
		competency: "Database Management",
		subCompetency: "Alat Analisa Data",
		recommendation: "Alat Analisa Data",
	},
	{
		competency: "Database Management",
		subCompetency: "Pembuatan Laporan",
		recommendation: "Pembuatan Laporan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pemahaman Sistem Manajemen",
		recommendation: "Pemahaman Sistem Manajemen",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Menjadi Trainer SM",
		recommendation: "Menjadi Trainer SM",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pembuatan Aturan",
		recommendation: "Pembuatan Aturan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pelaksanaan Audit",
		recommendation: "Pelaksanaan Audit",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Sertifikasi SM",
		recommendation: "Sertifikasi SM",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pendampingan",
		recommendation: "Pendampingan",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Strategi Pelaksanaan SM",
		recommendation: "Strategi Pelaksanaan SM",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pemahaman Alur Proses Kerja",
		recommendation: "Pemahaman Alur Proses Kerja",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pembuatan SOP Proses Kerja",
		recommendation: "Pembuatan SOP Proses Kerja",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Perbaikan Alur Proses Kerja",
		recommendation: "Perbaikan Alur Proses Kerja",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "PKB",
		recommendation: "PKB",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Standar MP",
		recommendation: "Standar MP",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "KPI",
		recommendation: "Pembuatan KPI",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Tim",
		recommendation: "Pengembangan Tim",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Organisasi",
		recommendation: "Pengembangan Organisasi",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengadaan Tenaga Kerja",
		recommendation: "Pengadaan Tenaga Kerja",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Mekanisme Comben",
		recommendation: "Mekanisme Comben",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP dalam fungsinya",
		recommendation: "SAP dalam fungsinya",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP luar fungsinya",
		recommendation: "SAP luar fungsinya",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "BluePrint Sistem",
		recommendation: "Pembuatan BluePrint Sistem",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Evaluasi SAP",
		recommendation: "Evaluasi SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Sistem Lain",
		recommendation: "Pengelolaan Sistem Lainnya",
	},
	{
		competency: "Financial Management",
		subCompetency: "Capex/Eapex",
		recommendation: "Pembuatan Capex/Eapex",
	},
	{
		competency: "Financial Management",
		subCompetency: "Laporan Keuangan",
		recommendation: "Pembuatan Laporan Keuangan",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost Benefit",
		recommendation: "Pembuatan Cost Benefit",
	},
	{
		competency: "Financial Management",
		subCompetency: "Financial",
		recommendation: "Pemahaman tentang Financial",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost",
		recommendation: "Pemahaman tentang Cost",
	},
	{
		competency: "Teritory Management",
		subCompetency: "Pemetaan Wilayah",
		recommendation: "Winning in GT (WIGET) 1.0",
	},
	{
		competency: "Teritory Management",
		subCompetency: "Pembagian Area Kerja",
		recommendation: "Winning in GT (WIGET) 1.0",
	},
	{
		competency: "Teritory Management",
		subCompetency: "Penguasaan Data Sales",
		recommendation: "Winning in GT (WIGET) 1.0",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Pengelolaan Distributor",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Kapasitas Produksi vs Target Sales",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Pemetaan Outlet",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Pemahaman Distribusi Noodle",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Management Stakeholder",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Pengelolaan Produk",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Merchandising Proses",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Distribution & Supply Chain Management",
		subCompetency: "Pengelolaan Distribusi",
		recommendation: "Training Distribution Management",
	},
	{
		competency: "Key Account Management",
		subCompetency: "Pemahaman MT",
		recommendation: "Winning in Modern Trade (WIMOT) 1.0",
	},
	{
		competency: "Key Account Management",
		subCompetency: "Analisa Konsumen MT",
		recommendation: "Winning in Modern Trade (WIMOT) 1.0",
	},
	{
		competency: "Key Account Management",
		subCompetency: "Analisa Service Level",
		recommendation: "Winning in Modern Trade (WIMOT) 1.0",
	},
	{
		competency: "Key Account Management",
		subCompetency: "Analisa SOS dan OSA",
		recommendation: "Winning in Modern Trade (WIMOT) 1.0",
	},
	{
		competency: "Key Account Management",
		subCompetency: "Pengelolaan Account",
		recommendation: "Winning in Modern Trade (WIMOT) 1.0",
	},
	{
		competency: "Key Account Management",
		subCompetency: "Pengelolaan TIM",
		recommendation: "Winning in Modern Trade (WIMOT) 1.0",
	},
	{
		competency: "Key Account Management",
		subCompetency: "Pelaksanaan Program Kerja",
		recommendation: "Winning in Modern Trade (WIMOT) 1.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Teknik Penjualan",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Pengelolaan TFR",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Efektifitas Joincall",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Market Audit",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Pengelolaan CWO / CWS",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Evaluasi Penjualan",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Pengelolaan Customer Complain",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Sales Management",
		subCompetency: "Sales Forecasting",
		recommendation: "WIGET 1.0 dan WIGET 2.0",
	},
	{
		competency: "Promotion Management",
		subCompetency: "Pemahaman Promosi",
		recommendation: "Winning in GT (WIGET) 1.0",
	},
	{
		competency: "Promotion Management",
		subCompetency: "Strategi Promosi",
		recommendation: "Winning in GT (WIGET) 1.0",
	},
	{
		competency: "Promotion Management",
		subCompetency: "Pengelolaan Promosi",
		recommendation: "Winning in GT (WIGET) 1.0",
	},
	{
		competency: "Promotion Management",
		subCompetency: "Pengelolaan Program",
		recommendation: "Winning in GT (WIGET) 1.0",
	},
	{
		competency: "Trade Marketing Management",
		subCompetency: "Pemahaman Planogram",
		recommendation: "Training Trade Marketing",
	},
	{
		competency: "Trade Marketing Management",
		subCompetency: "Pemahaman Prilaku Konsumen",
		recommendation: "Training Trade Marketing",
	},
	{
		competency: "Trade Marketing Management",
		subCompetency: "Pemetaan Outlet",
		recommendation: "Training Trade Marketing",
	},
	{
		competency: "Trade Marketing Management",
		subCompetency: "Pemahaman Market Share",
		recommendation: "Training Trade Marketing",
	},
	{
		competency: "Trade Marketing Management",
		subCompetency: "Pengelolaan Program Promosi",
		recommendation: "Training Trade Marketing",
	},
	{
		competency: "Trade Marketing Management",
		subCompetency: "POP Driver",
		recommendation: "Training Trade Marketing",
	},
	{
		competency: "Brand Management",
		subCompetency: "Pemahaman Brand",
		recommendation: "Training Brand Management",
	},
	{
		competency: "Brand Management",
		subCompetency: "Pengelolaan Brand",
		recommendation: "Training Brand Management",
	},
	{
		competency: "Brand Management",
		subCompetency: "Pengelolaan Program Kerja",
		recommendation: "Training Brand Management",
	},
	{
		competency: "Brand Management",
		subCompetency: "Pemetaan Kompetitor",
		recommendation: "Training Brand Management",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Filing Dokument",
		recommendation: "",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "MS Office",
		recommendation: "",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Prosedur Klaim",
		recommendation: "Training Administrasi BO & Finansial terkait",
	},
	{
		competency: "Administration Mastering",
		subCompetency: "Koordinasi",
		recommendation: "",
	},
	{
		competency: "Database Management",
		subCompetency: "Database Dokumen",
		recommendation: "Training Mc.Office (Excel, PPT)",
	},
	{
		competency: "Database Management",
		subCompetency: "Alat Analisa Data",
		recommendation: "Training 7 Tools",
	},
	{
		competency: "Database Management",
		subCompetency: "Pembuatan Laporan",
		recommendation: "",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pemahaman Sistem Manajemen",
		recommendation: "Basic Sistem Management",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Menjadi Trainer SM",
		recommendation: "",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pembuatan Aturan",
		recommendation: "",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pelaksanaan Audit",
		recommendation: "",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Sertifikasi SM",
		recommendation: "",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Pendampingan",
		recommendation: "",
	},
	{
		competency: "Sistem Management Mastering",
		subCompetency: "Strategi Pelaksanaan SM",
		recommendation: "",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pemahaman Alur Proses Kerja",
		recommendation: "Training Penyusunan SOP",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Pembuatan SOP Proses Kerja",
		recommendation: "Training Lean MFG",
	},
	{
		competency: "Business Process Management",
		subCompetency: "Perbaikan Alur Proses Kerja",
		recommendation: "",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "PKB",
		recommendation: "HR Management/HR for Non HR",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Standar MP",
		recommendation: "HR Management/HR for Non HR",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "KPI",
		recommendation: "HR Management/HR for Non HR",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Tim",
		recommendation: "HR Management/HR for Non HR",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengembangan Organisasi",
		recommendation: "HR Management/HR for Non HR",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Pengadaan Tenaga Kerja",
		recommendation: "HR Management/HR for Non HR",
	},
	{
		competency: "Manajemen Sumber Daya Manusia",
		subCompetency: "Mekanisme Comben",
		recommendation: "HR Management/HR for Non HR",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP dalam fungsinya",
		recommendation: "Training SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "SAP luar fungsinya",
		recommendation: "Training SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "BluePrint Sistem",
		recommendation: "Training SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Evaluasi SAP",
		recommendation: "Training SAP",
	},
	{
		competency: "SAP Mastering",
		subCompetency: "Sistem Lain",
		recommendation: "Training SAP",
	},
	{
		competency: "Financial Management",
		subCompetency: "Capex/Eapex",
		recommendation: "Finon",
	},
	{
		competency: "Financial Management",
		subCompetency: "Laporan Keuangan",
		recommendation: "Finon",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost Benefit",
		recommendation: "Finon",
	},
	{
		competency: "Financial Management",
		subCompetency: "Financial",
		recommendation: "Finon",
	},
	{
		competency: "Financial Management",
		subCompetency: "Cost",
		recommendation: "Finon",
	},
];

async function main() {
	console.log(`Mulai proses seeding untuk Rekomendasi Pelatihan...`);

	console.log(`Menghapus data rekomendasi lama...`);
	await prisma.trainingRecommendation.deleteMany({});

	console.log(
		`Memasukkan ${recommendationsData.length} data rekomendasi baru...`
	);
	await prisma.trainingRecommendation.createMany({
		data: recommendationsData,
		skipDuplicates: true,
	});

	console.log(`Proses seeding Rekomendasi Pelatihan selesai.`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
